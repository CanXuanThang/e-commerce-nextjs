import { haVibes } from "./ha-vibes";
import { lightTouch } from "./light-touch";
import { summerOutfitIdeas } from "./summer-outfit-ideas";
import { weddingOutfitMen } from "./wedding-outfit-men";

export const blogs = [
  ...haVibes,
  ...lightTouch,
  ...summerOutfitIdeas,
  ...weddingOutfitMen,
];

export function getBlogBySlug(slug: string, locale: string) {
  return blogs.find((blog) => blog.slug === slug && blog.locale === locale);
}

export function getAllBlogSlugs() {
  return blogs.map((blog) => ({
    slug: blog.slug,
    locale: blog.locale,
  }));
}

export const getBlogByLocale = (locale: string) => {
  return blogs.filter((blog) => blog.locale === locale);
};
