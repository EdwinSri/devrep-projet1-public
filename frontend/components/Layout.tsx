import { ReactNode } from 'react';

import Head from 'next/head';

import { MyNavbar } from '@/components/Navbar';
import {
  AppShell,
  Container,
} from '@mantine/core';

export interface LayoutProps {
  title?: string;
  children?: ReactNode;
  fullWidth?: boolean;
}

export default function Layout(props: LayoutProps) {
  return (
    <>
      <Head>
        {props.title && <title>{props.title + ' - Drlib'}</title>}
      </Head>
      <AppShell
        navbar={<MyNavbar />}
      >
        <Container fluid>
          {props.title ? <h1>{props.title}</h1> : ''}
          <div style={!props.fullWidth ? { maxWidth: 1000 } : {}}>
            {props.children}
          </div>
        </Container>
      </AppShell>
    </>
  );
}
