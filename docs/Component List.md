## Shared / UI Primitives

- **`SectionHeader`** — section title label (used in Profile, Checkout, Order Detail)
- **`ScreenHeader`** — back button + title + optional right action (used on every non-tab screen)

---

## Navigation

- **`BottomTabBar`** — Shop / Cart / Orders / Account tabs (persistent on main screens)
- **`StepProgressBar`** — Shipping → Payment → Review (Checkout only, but reusable for any wizard)
- **`OrderProgressTrack`** — Ordered → Packed → Shipped → Delivered tracker

---

## Product Components

- **`ProductCard`** — image, name, price tile (Product List grid)
- **`ProductGrid`** — wraps ProductCard in a 2-col layout with search/filter header
- **`SearchBar`** — search input with icon
- **`FilterChip`** — All / Sale / Tops / Shoes pill toggles
- **`SizeSelector`** — XS/S/M/L/XL pill group with active state
- **`ColorSwatch`** — circular color option dots
- **`StarRating`** — star display + review count

---

## Cart & Checkout Components

- **`CartItem`** — thumbnail, name, size/color, quantity stepper, price
- **`QuantityStepper`** — `−` / count / `+` control (reusable anywhere)
- **`OrderSummaryRow`** — label + value row (Subtotal, Shipping, Total)
- **`SavedPaymentMethod`** — card icon, masked number, Default badge
- **`AddressForm`** — Full Name, Street, City, ZIP fields grouped

---

## Account / Auth Components

- **`ProfileInfoRow`** — label + value display row (Email, Phone, Birthday)
- **`AccountMenuItem`** — chevron list item (Profile & Details, Order History, etc.)
- **`SavedAddressCard`** — address display with Default badge + edit action

---

## Order Components

- **`OrderHistoryCard`** — order number, date, item count, amount, StatusChip
- **`OrderLineItem`** — product name + variant, qty, price (used in Order Detail and Cart)
