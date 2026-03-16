export function slugify(str: string): string {
    if (!str) return "";

    // Convert to lower case
    let slug = str.toLowerCase();

    // Remove accents
    slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Handle specific Vietnamese characters that normalize might miss or handle differently
    const from = "đ";
    const to = "d";
    for (let i = 0; i < from.length; i++) {
        slug = slug.replace(new RegExp(from[i], "g"), to[i]);
    }

    // Replace special characters with hyphens
    slug = slug.replace(/[^a-z0-9]/g, "-")
               .replace(/-+/g, "-")           // Collapse multiple hyphens
               .replace(/^-+|-+$/g, "");      // Trim leading/trailing hyphens

    return slug;
}
