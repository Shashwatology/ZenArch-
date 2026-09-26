# ZEN ARCH — H1 ADMIN CAPABILITY MATRIX

## 1. PRODUCT CATALOGUE CAPABILITIES

| PUBLIC FIELD | CURRENT SOURCE | ADMIN EDITABLE? | ADMIN LOCATION | DATABASE FIELD | MEDIA SOURCE | MISSING CONTROL |
|---|---|---|---|---|---|---|
| Product name | PostgreSQL | Partially (UI missing edit form) | `/admin/products` | `Product.name` | N/A | Full edit form, bulk actions |
| SKU | PostgreSQL | No | N/A | `Product.sku` | N/A | Edit field, variant SKUs |
| Slug | PostgreSQL | No | N/A | `Product.slug` | N/A | Auto-generation or manual edit |
| Collection | PostgreSQL | No | N/A | `Product.collectionId` | N/A | Dropdown selection |
| Category | PostgreSQL | No | N/A | `Product.categoryId` | N/A | Dropdown selection |
| Description | PostgreSQL | No | N/A | `Product.description` | N/A | Rich text editor |
| Price | PostgreSQL | No | N/A | `Product.basePrice` | N/A | Decimal input |
| Price status | PostgreSQL | No | N/A | `Product.priceStatus` | N/A | Enum dropdown (VERIFIED, CONFLICT, etc) |
| Dimensions | PostgreSQL | No | N/A | `Product.dimensions` | N/A | Structured WxDxH input |
| Specifications | PostgreSQL | No | N/A | `ProductSpecification` | N/A | Add/Edit/Delete/Reorder list |
| Variants | PostgreSQL | No | N/A | `ProductVariant` | N/A | Variant CRUD (Currently 330 auto-generated 'Standard' variants exist) |
| Images | PostgreSQL | No | N/A | `ProductImage.url` | External URL string | Upload/Drag-drop, Replace, Delete, Reorder |
| Cover image | PostgreSQL | No | N/A | `ProductImage.isCover` | External URL string | Set as cover toggle |
| Stock | PostgreSQL | Partially | `/admin/inventory` | `InventoryItem.quantity` | N/A | Stock movement/reason logs |
| Featured | PostgreSQL | No | N/A | `Product.isFeatured` | N/A | Toggle switch |
| Best seller | PostgreSQL | No | N/A | `Product.isBestSeller` | N/A | Toggle switch |
| Published | PostgreSQL | No | N/A | `Product.status` | N/A | Enum (DRAFT/PUBLISHED/ARCHIVED) |
| 3D asset | Hardcoded logic | No | N/A | N/A | Local files | GLB/USDZ upload manager |
| AR asset | Hardcoded logic | No | N/A | N/A | Local files | AR flag & asset upload |
| SEO title | Missing / Hardcoded | No | N/A | Missing / Hardcoded | N/A | DB column + Edit field |
| SEO description | Missing / Hardcoded | No | N/A | Missing / Hardcoded | N/A | DB column + Edit field |
| Canonical | Missing / Hardcoded | No | N/A | Missing / Hardcoded | N/A | DB column + Edit field |
| OG image | Missing / Hardcoded | No | N/A | Missing / Hardcoded | N/A | DB column + Media picker |

## 2. PROJECT / WORK CAPABILITIES

| PUBLIC FIELD | CURRENT SOURCE | ADMIN EDITABLE? | ADMIN LOCATION | DATABASE FIELD | MEDIA SOURCE | MISSING CONTROL |
|---|---|---|---|---|---|---|
| Project Title | PostgreSQL | No | N/A | `Project.name` | N/A | Create/Edit UI |
| Location | PostgreSQL | No | N/A | `Project.location` | N/A | Edit field |
| Year | PostgreSQL | No | N/A | `Project.year` | N/A | Edit field |
| Project Type | PostgreSQL | No | N/A | `Project.category` | N/A | Edit field |
| Description | PostgreSQL | No | N/A | `Project.description` | N/A | Rich text editor |
| Cover image | PostgreSQL | No | N/A | `ProjectImage.url (isCover)` | External URL string | Media manager |
| Gallery | PostgreSQL | No | N/A | `ProjectImage` | External URL string | Drag/Drop uploader |
| Image order | PostgreSQL | No | N/A | `ProjectImage.order` | N/A | Drag/Drop reorder |
| Captions | PostgreSQL | No | N/A | `ProjectImage.altText` | N/A | Input per image |
| SEO | Missing / Hardcoded | No | N/A | Missing / Hardcoded | N/A | SEO Meta inputs |
| Published | PostgreSQL | No | N/A | `Project.status` | N/A | Publish/Draft toggle |

## 3. SERVICES CAPABILITIES

| PUBLIC FIELD | CURRENT SOURCE | ADMIN EDITABLE? | ADMIN LOCATION | DATABASE FIELD | MEDIA SOURCE | MISSING CONTROL |
|---|---|---|---|---|---|---|
| Name | PostgreSQL | No | N/A | `Service.name` | N/A | Edit field |
| Description | PostgreSQL | No | N/A | `Service.description` | N/A | Rich text editor |
| Image | PostgreSQL | No | N/A | `Service.imageUrl` | External URL string | Image upload |
| CTA | Hardcoded React | No | N/A | N/A | N/A | DB field for CTA link/text |
| SEO | Missing | No | N/A | N/A | N/A | SEO Meta inputs |
| Published | PostgreSQL | No | N/A | `Service.status` | N/A | Publish/Draft toggle |

## 4. HOMEPAGE CONTENT CAPABILITIES

| PUBLIC FIELD | CURRENT SOURCE | ADMIN EDITABLE? | ADMIN LOCATION | DATABASE FIELD | MEDIA SOURCE | MISSING CONTROL |
|---|---|---|---|---|---|---|
| Hero copy | Hardcoded React | No | N/A | `PageContent.heroCopy` | N/A | CMS text input |
| Featured products | Mix of DB & React | No | N/A | `Product.isFeatured` | N/A | Merchandising UI |
| Best sellers | Mix of DB & React | No | N/A | `Product.isBestSeller` | N/A | Merchandising UI |
| Featured projects | Hardcoded React | No | N/A | N/A | N/A | Merchandising UI |
| Services | Hardcoded React | No | N/A | N/A | N/A | CMS UI |
| AI section content | Hardcoded React | No | N/A | N/A | N/A | CMS text input |
| Studio content | Hardcoded React | No | N/A | N/A | N/A | CMS text input |
| Final CTA | Hardcoded React | No | N/A | N/A | N/A | CMS text input |

## 5. CRITICAL DATABASE MISMATCHES
- Currently, standard "Variants" were purely generated via the initial data import, producing 330 "Standard" variants without distinct pricing or visual variance. 
- 3D/AR assets are largely hardcoded into the React Drei fiber canvas logic rather than mapped dynamically to `Product` rows via an asset URL DB field.
- SEO fields for `Product` and `Project` are absent from the `schema.prisma` in H0, but have been explicitly added in the H0 architectural corrections (`seoTitle`, `seoDescription`, `canonical`, `ogImage` via `PageContent` or as we should add to `Product`).

**Audit Conclusion:** There are NO critical blocking database mismatches that prevent H1 implementation. We just need to add SEO fields directly to `Product` and `Project` if they are missing, and we can proceed safely.
