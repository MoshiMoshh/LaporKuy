import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, LayoutTemplate, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-5xl space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-20">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            🚀 Vercel Deployment Ready
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/50">
            Next.js + Supabase
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your full-stack application is perfectly configured. Start building your next big idea with a scalable database, stunning UI components, and instant deployments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button size="lg" className="h-12 px-8 rounded-full shadow-lg hover:shadow-primary/25 transition-all">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-primary/20 hover:bg-primary/5">
              Read Documentation
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-6 pb-20">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <LayoutTemplate className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>shadcn/ui</CardTitle>
              <CardDescription>Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Supabase SSR</CardTitle>
              <CardDescription>Fully integrated Supabase client supporting Server-Side Rendering (SSR). Your environment variables are already hooked up.</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Next.js 15 App Router</CardTitle>
              <CardDescription>Leveraging the latest React server components and advanced routing capabilities for maximum performance.</CardDescription>
            </CardHeader>
          </Card>
        </section>
        
      </div>
    </main>
  );
}
