"use client";

import * as React from "react";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccountSwitcher } from "@/components/account-switcher";
import { MailDisplay } from "@/components/mail-display";
import { MailList } from "@/components/mail-list";
import { Nav } from "@/components/nav";
// import { type Mail } from "../app/data";
// import { useMail } from "../app/use-mail";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: any[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  accounts,
  mails,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedMail, setSelectedMail] = React.useState<Mail | null>(null);  // Update state to hold selected mail
  const [selectedFolder, setSelectedFolder] = React.useState("Inbox"); // State for selected folder
  const [selectedCategory, setSelectedCategory] = React.useState(null); // State for selected category

  // Function to select folder and clear category
  const handleSelectFolder = (folder) => {
    setSelectedFolder(folder);
    setSelectedCategory(null); // Clear category when folder is selected
  };

  // Function to select category and clear folder
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setSelectedFolder(null); // Clear folder when category is selected
  };

  // Filter mails based on selected folder or category
  console.log("all mail items:", mails)
  const filteredMails = mails.filter((item) => {
    if (selectedFolder) return item.folder === selectedFolder;
    if (selectedCategory) return item.category === selectedCategory;
    return true;
  });
  console.log("filteredMails items:", filteredMails)

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={(collapsed) => {
            setIsCollapsed(collapsed);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              collapsed
            )}`;
          }}
          className={cn(
            isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[56px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
          </div>
          <Separator />

          {/* Folder Navigation */}
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Inbox",
                // label: "128",
                icon: Inbox,
                variant: selectedFolder === "Inbox" ? "default" : "ghost",
                onClick: () => handleSelectFolder("Inbox"),
              },
              {
                title: "Drafts",
                // label: "9",
                icon: File,
                variant: selectedFolder === "Drafts" ? "default" : "ghost",
                onClick: () => handleSelectFolder("Drafts"),
              },
              {
                title: "Sent",
                // label: "",
                icon: Send,
                variant: selectedFolder === "Sent" ? "default" : "ghost",
                onClick: () => handleSelectFolder("Sent"),
              },
              {
                title: "Junk",
                // label: "23",
                icon: ArchiveX,
                variant: selectedFolder === "Junk" ? "default" : "ghost",
                onClick: () => handleSelectFolder("Junk"),
              },
              {
                title: "Trash",
                // label: "",
                icon: Trash2,
                variant: selectedFolder === "Trash" ? "default" : "ghost",
                onClick: () => handleSelectFolder("Trash"),
              },
              {
                title: "Archive",
                // label: "",
                icon: Archive,
                variant: selectedFolder === "Archive" ? "default" : "ghost",
                onClick: () => handleSelectFolder("Archive"),
              },
            ]}
          />

          <Separator />

          {/* Category Navigation */}
          <Nav
            isCollapsed={isCollapsed}
            links={mails
              .map((mail) => mail.category)
              .filter((value, index, self) => self.indexOf(value) === index) // Get unique categories
              .map((category) => ({
                title: category,
                label: mails.filter((mail) => mail.category === category).length.toString(),
                icon: Inbox, // Replace with actual icons for each category
                variant: selectedCategory === category ? "default" : "ghost",
                onClick: () => handleSelectCategory(category),
              }))}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">
                {selectedFolder || selectedCategory || "All Mail"}
              </h1>
              {/* Display selected folder or category */}
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
            <MailList items={filteredMails} onSelectMail={setSelectedMail} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
            <MailList items={filteredMails.filter((item) => !item.read)} onSelectMail={setSelectedMail} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          {/* <MailDisplay mail={mails.find((item) => item.id === selectedMail?.id) || null} /> */}
          <MailDisplay mail={selectedMail} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
