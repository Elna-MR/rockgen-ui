import { redirect } from "next/navigation";

/** Legacy Understand hub, merged into Learn → ALS. */
export default function UnderstandHubRedirect() {
  redirect("/diseases/primers/als#plain-language");
}
