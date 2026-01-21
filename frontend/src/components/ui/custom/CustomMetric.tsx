import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../card'

interface CustomMetricProps {
  title: string
  data: string | number
  description?: string | null
  color?: string
  icon?: React.ReactNode
}

const CustomMetric: React.FC<CustomMetricProps> = ({ title, data, description = null, color = '', icon = null }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>

      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>{data}</div>

        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

export default CustomMetric
