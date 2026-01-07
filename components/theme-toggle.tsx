"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) return <Button variant="ghost" size="icon" className="size-9" disabled />

  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light"

  return (
    <Button variant="ghost" size="icon" className="size-9" onClick={() => setTheme(next)}>
      {theme === "light" && <Sun className="size-4" />}
      {theme === "dark" && <Moon className="size-4" />}
      {theme === "system" && <Monitor className="size-4" />}
      <span className="sr-only">切换主题</span>
    </Button>
  )
}
