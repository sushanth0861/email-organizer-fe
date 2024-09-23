'use client'; // Ensure this line is at the top

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';

import { Mail } from '@/components/mail';
import "./mdx.css"
import { accounts } from './data';

export default function MailPage() {
  const [defaultLayout, setDefaultLayout] = useState(undefined);
  const [defaultCollapsed, setDefaultCollapsed] = useState(undefined);
  const [mails, setMails] = useState([]); // State to hold the mails fetched from backend

  useEffect(() => {
    // Fetch mails from backend
    const fetchMails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mails`);
        const data = await response.json();
        setMails(data);
      } catch (error) {
        console.error('Error fetching mails:', error);
      }
    };

    fetchMails();

    const layout = Cookies.get('react-resizable-panels:layout');
    const collapsed = Cookies.get('react-resizable-panels:collapsed');
    
    const parseJSON = (value: string) => {
      if (!value) {
        // Log and return undefined if the value is falsy (null, undefined, empty string)
        console.warn('No valid JSON string found:', value);
        return undefined;
      }
      
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        return undefined;
      }
    };
    
    // Safely parse the layout and collapsed cookies
    setDefaultLayout(layout ? parseJSON(layout) : undefined);
    setDefaultCollapsed(collapsed ? parseJSON(collapsed) : undefined);
    
    // Add the no-scroll class to the body when the component mounts
    document.body.classList.add('no-scroll');

    // Remove the no-scroll class when the component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <Mail
          accounts={accounts}
          mails={mails}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
}
