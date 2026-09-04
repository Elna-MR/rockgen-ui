import { redirect } from "next/navigation";

/** Legacy Approach URL — page is now Mechanism first. */
export default function ApproachRedirect() {
  redirect("/mechanism-first");
}
