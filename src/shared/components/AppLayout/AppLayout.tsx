import { BookOutlined } from '@ant-design/icons'
import { Layout, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Link, Outlet, ScrollRestoration } from 'react-router'
import {
  CONTENT_MAX_WIDTH,
  HEADER_HEIGHT,
  OPEN_LIBRARY_BASE_URL,
  PAGE_GUTTER,
  PAGE_PADDING_BLOCK,
  ROUTE_PATHS,
  STRINGS,
} from '@/constants'
import { ThemeToggle } from '../ThemeToggle'
import styles from './AppLayout.module.css'

interface AppLayoutProps {
  /** Defaults to the matched child route. */
  children?: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Layout style={{ minHeight: '100dvh', background: 'transparent' }}>
      <Layout.Header
        className={styles.header}
        style={{ height: HEADER_HEIGHT, lineHeight: 'normal' }}
      >
        <Link to={ROUTE_PATHS.home} className={styles.brand}>
          <BookOutlined
            style={{ fontSize: 24, color: 'var(--ant-color-primary)' }}
            aria-hidden="true"
          />
          {STRINGS.app.name}
        </Link>
        <ThemeToggle />
      </Layout.Header>

      <Layout.Content
        style={{
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
          flex: 1,
          padding: `${PAGE_PADDING_BLOCK}px ${PAGE_GUTTER}px`,
          background: 'transparent',
        }}
      >
        {children ?? <Outlet />}
      </Layout.Content>

      <Layout.Footer className={styles.footer} style={{ background: 'transparent', padding: 0 }}>
        <div
          style={{
            maxWidth: CONTENT_MAX_WIDTH,
            margin: '0 auto',
            padding: `24px ${PAGE_GUTTER}px`,
          }}
        >
          <Typography.Text type="secondary">
            {STRINGS.app.attribution}{' '}
            <a href={OPEN_LIBRARY_BASE_URL} target="_blank" rel="noreferrer">
              {STRINGS.app.openLibrary}
            </a>
            {'.'}
          </Typography.Text>
        </div>
      </Layout.Footer>
      <ScrollRestoration />
    </Layout>
  )
}
