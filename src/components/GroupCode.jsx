import { useState } from 'react'
import { useSettings } from '../lib/settings.jsx'

/** The Sirkl group code, shown as a glowing chip with a one-tap copy button. */
export default function GroupCode({ inline = false }) {
  const { settings } = useSettings()
  const [copied, setCopied] = useState(false)
  const code = settings.sirkl_group_code
  if (!code) return null

  if (inline) return <strong className="group-code-inline">{code}</strong>

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked: the code is still visible to type in */
    }
  }

  return (
    <span className="group-code">
      <span className="group-code-label">Group code</span>
      <span className="group-code-value">{code}</span>
      <button type="button" className="group-code-copy" onClick={copy} aria-label={`Copy group code ${code}`}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </span>
  )
}
