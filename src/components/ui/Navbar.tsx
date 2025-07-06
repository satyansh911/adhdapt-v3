"use client"

import React from "react"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

type ListItemProps = {
  title: string
  href: string
  children?: React.ReactNode
}

function ListItem({ title, href, children }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1.5 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export function NavigationMenuDemo() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">ADHDapt</span>
        </div>

        {/* Center: Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Home</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                        href="/"
                      >
                        <Brain className="h-6 w-6" />
                        <div className="mt-4 mb-2 text-lg font-medium">ADHDapt</div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          Tools and resources designed for ADHD minds to help you thrive.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/about" title="About Us">
                    Learn about our mission to support the ADHD community.
                  </ListItem>
                  <ListItem href="/getting-started" title="Getting Started">
                    New to ADHDapt? Start your journey here.
                  </ListItem>
                  <ListItem href="/features" title="Features">
                    Discover all the tools available to help you succeed.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem title="Focus Timer" href="/tools/focus-timer">
                    Pomodoro-style timer designed for ADHD minds with customizable intervals.
                  </ListItem>
                  <ListItem title="Task Breakdown" href="/tools/task-breakdown">
                    Break down overwhelming tasks into manageable, bite-sized steps.
                  </ListItem>
                  <ListItem title="Habit Tracker" href="/tools/habit-tracker">
                    Visual habit tracking with ADHD-friendly reminders and rewards.
                  </ListItem>
                  <ListItem title="Mind Dump" href="/tools/mind-dump">
                    Quickly capture racing thoughts and organize them later.
                  </ListItem>
                  <ListItem title="Daily Planner" href="/tools/daily-planner">
                    ADHD-friendly planning tools with time blocking and priority setting.
                  </ListItem>
                  <ListItem title="Distraction Blocker" href="/tools/distraction-blocker">
                    Website and app blocking to help maintain focus during work sessions.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/resources">Resources</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Community</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/community/forums">
                        <div className="font-medium">Forums</div>
                        <div className="text-muted-foreground">Connect with others in the ADHD community.</div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/community/success-stories">
                        <div className="font-medium">Success Stories</div>
                        <div className="text-muted-foreground">Read inspiring stories from our community.</div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/community/support-groups">
                        <div className="font-medium">Support Groups</div>
                        <div className="text-muted-foreground">Join local and online support groups.</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Support</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/support/help" className="flex items-center gap-2">
                        <CircleHelpIcon className="h-4 w-4" />
                        Help Center
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/support/contact" className="flex items-center gap-2">
                        <CircleIcon className="h-4 w-4" />
                        Contact Us
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/support/feedback" className="flex items-center gap-2">
                        <CircleCheckIcon className="h-4 w-4" />
                        Feedback
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right: Auth Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
