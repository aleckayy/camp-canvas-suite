import type { ReactNode } from "react";
import { Search, Bell, Plus } from "lucide-react";

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <div className="relative hidden flex-1 max-w-md md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar participantes, grupos, actividades…"
              className="h-9 pl-9 bg-muted/40 border-transparent focus-visible:bg-background"
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Button size="sm" className="hidden sm:inline-flex gap-1.5">
              <Plus className="h-4 w-4" />
              Nuevo
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notificaciones" className="rounded-full relative">
              <Bell className="h-[1.1rem] w-[1.1rem]" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
            <ThemeToggle />
            <Avatar className="h-8 w-8 ml-1">
              <AvatarFallback className="bg-[image:var(--gradient-primary)] text-primary-foreground text-xs font-semibold">
                AK
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}