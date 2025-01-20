import { appConfig } from "@config/ui";
import { Separator } from "@ui/components/ui/separator";
import { Copyright } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4 gap-10 justify-items-start sm:justify-items-center">
        <div className="flex flex-col gap-5">
          <h1 className="font-secondary font-medium">{appConfig.title}</h1>
          <p className="w-60 text-muted-foreground text-sm">A startup based out of Bangalore</p>
        </div>
        <div>
          <h1 className="font-secondary font-medium">Reach Out</h1>

          <div className="mt-5 text-muted-foreground text-sm flex flex-col">
            <p>Anjana Dhilip Krishna</p>
            <a href="tel:+919940671975" className="mt-5 hover:text-primary hover:underline">
              +919940671975
            </a>
            <a href="mailto:samjnaanalytics@gmail.com" className="hover:text-primary hover:underline">
              samjnaanalytics@gmail.com
            </a>
            <a href="mailto:info@samjna.co.in">info@samjna.co.in</a>
          </div>
        </div>
        <div>
          <h1 className="font-secondary font-medium">Contact Us</h1>
          <div className="mt-5 text-muted-foreground text-sm">
            <p className="w-60 mt-5">
              Flat D3, Casa Lavelle VI
              <br /> 12/7, Lavelle Road
              <br /> Bangalore - 560001
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center bg-custom-background text-muted-foreground backdrop-blur-md h-12 text-xs border-t border-border">
        <div className="flex w-[75%] mx-auto justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">Privacy Policy</Link>
            <Separator orientation="vertical" className="h-4 bg-muted-foreground" />
            <Link href="/">Terms & Conditions</Link>
          </div>
          <div className="flex gap-1 items-center">
            <span>Copyright</span>
            <Copyright className="w-3 h-3" />
            <span>
              {appConfig.copyright} {appConfig.title}. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
