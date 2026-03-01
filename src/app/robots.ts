import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/adminlogin", "/dashboard", "/checkout", "/api"],
      },
    ],
    sitemap: "https://zarobakehouse.com/sitemap.xml",
  };
}