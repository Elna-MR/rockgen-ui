import { redirect } from "next/navigation";

/** Legacy Understand hub — merged into Learn → ALS. */
export default function UnderstandHubRedirect() {
  redirect("/learn/als#plain-language");
}
