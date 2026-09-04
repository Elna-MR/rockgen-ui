import { redirect } from "next/navigation";

/** Legacy URL — page is now Mechanism first. */
export default function HowItWorksRedirect() {
  redirect("/mechanism-first");
}
