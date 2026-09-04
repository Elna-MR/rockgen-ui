import { redirect } from "next/navigation";

/** Legacy Approach URL — renamed to How it works. */
export default function ApproachRedirect() {
  redirect("/how-it-works");
}
