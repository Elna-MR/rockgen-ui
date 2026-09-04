import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

/** Legacy Understand articles — merged into Learn → ALS plain language. */
export default async function UnderstandArticleRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/learn/als/plain/${slug}`);
}
