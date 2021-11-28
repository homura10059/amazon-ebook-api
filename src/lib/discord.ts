import { WebhookClient } from 'discord.js'

import { ALERT_WEB_HOOK_URL } from './constsnts'

export type Field = {
  name: string
  value: string
  inline?: boolean
}

export type Embed = {
  title: string
  description?: string
  url: string
  timestamp?: string
  color: number
  footer?: {
    text: string
    icon_url: string
  }
  image?: {
    url: string
  }
  thumbnail?: {
    url: string
  }
  author?: {
    name: string
    url: string
    icon_url: string
  }
  fields: Field[]
}

export type Body = {
  content: string
  embeds: Embed[]
}

export const getIdAndToken = (url: string): { id: string; token: string } => {
  const [id, token] = url.split('/').slice(-2)
  return { id, token }
}

export const notify = async ({
  webhookUrl,
  body
}: {
  webhookUrl: string
  body: Body
}) => {
  const { id, token } = getIdAndToken(webhookUrl)
  const hook = new WebhookClient(id, token)
  await hook.send(body)
}

export const notifyError = async (e: Error) => {
  const { id, token } = getIdAndToken(ALERT_WEB_HOOK_URL)

  const hook = new WebhookClient(id, token)
  await hook.send(e.message)
}
