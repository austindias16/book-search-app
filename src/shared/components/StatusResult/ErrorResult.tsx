import { ReloadOutlined } from '@ant-design/icons'
import { Button, Result, Typography } from 'antd'
import type { ReactNode } from 'react'
import { STRINGS } from '@/constants'

interface ErrorResultProps {
  status?: '404' | 'error'
  title?: string
  subTitle?: ReactNode
  onRetry?: () => void
}

export function ErrorResult({
  status = 'error',
  title = STRINGS.status.errorTitle,
  subTitle = STRINGS.status.errorBody,
  onRetry,
}: ErrorResultProps) {
  return (
    <Result
      status={status}
      title={<Typography.Title level={3}>{title}</Typography.Title>}
      subTitle={subTitle}
      extra={
        onRetry && (
          <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
            {STRINGS.status.retry}
          </Button>
        )
      }
    />
  )
}
