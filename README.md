# TollGate — Operator Dashboard

A full-stack **Toll Plaza Management System** built with **Angular 17+** (standalone components), **Tailwind CSS**, and a **Node.js/Express** backend.

---

## Project Structure

```
toll-plaza/
├── backend/                  # Node.js + Express API
│   ├── server.js             # Main server — all routes + business logic
│   └── package.json
│
└── frontend/                 # Angular 17+ app
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── dashboard/          # Main vehicle log table + filters
    │   │   │   ├── new-entry-form/     # Sidebar form to add vehicles
    │   │   │   └── stats-card/         # Reusable stat widget
    │   │   ├── models/
    │   │   │   └── toll-log.model.ts   # Interfaces: TollLog, CreateTollLogDto, etc.
    │   │   ├── pipes/
    │   │   │   └── toll-currency.pipe.ts  # Formats fee as "$5.00" or "FREE"
    │   │   ├── services/
    │   │   │   └── toll.service.ts     # HTTP service for all API calls
    │   │   ├── app.component.ts        # Root layout + header
    │   │   └── app.config.ts           # Angular providers (HttpClient, Router)
    │   ├── styles.css                  # Tailwind directives + custom classes
    │   └── index.html
    ├── tailwind.config.js
    ├── angular.json
    └── package.json
```

---

## Quick Start

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- **Angular CLI** v17+ → `npm install -g @angular/cli`

---

### 1. Backend Setup

```bash
cd toll-plaza/backend
npm install
npm start
```

> Server runs at **http://localhost:3000**  
> You'll see: `Toll Plaza API running at http://localhost:3000`

---

### 2. Frontend Setup

```bash
cd toll-plaza/frontend
npm install
ng serve
```

> App runs at **http://localhost:4200**

---

## API Endpoints

| Method   | Endpoint            | Description                         |
|----------|---------------------|-------------------------------------|
| `GET`    | `/logs`             | Fetch all toll records (newest first) |
| `POST`   | `/logs`             | Create new vehicle entry             |
| `PATCH`  | `/logs/:id/status`  | Update status (Paid/Pending/Violation) |
| `DELETE` | `/logs/:id`         | Remove a log entry                   |
| `GET`    | `/health`           | Health check                         |

### POST /logs — Request Body

```json
{
  "licensePlate": "MH12AB1234",
  "vehicleType": "Car",       // "Car" | "Motorcycle" | "Truck"
  "isOfficial": false         // optional — true waives fee
}
```

---

## Fee Calculator (Business Logic)

| Vehicle Type | Fee    | Official/Govt |
|-------------|--------|---------------|
| Car          | $5.00  | $0.00 (FREE)  |
| Motorcycle   | $2.00  | $0.00 (FREE)  |
| Truck        | $10.00 | $0.00 (FREE)  |

Fee is automatically calculated server-side when `POST /logs` is called.

---

## Styling Architecture

The project uses **Tailwind CSS v3** with a custom design system:

### Color Palette (defined in `tailwind.config.js`)
```js
toll: {
  bg:        '#0A0C10',   // page background
  surface:   '#111318',   // input backgrounds
  card:      '#161A22',   // card backgrounds
  border:    '#1E2430',   // borders
  accent:    '#F5A623',   // amber accent — fees, CTAs
  green:     '#22C55E',   // Paid status
  yellow:    '#F59E0B',   // Pending status
  red:       '#EF4444',   // Violation status
  blue:      '#3B82F6',   // Govt/Official
  text:      '#E8EAF0',   // primary text
  textDim:   '#8892A4',   // secondary text
}
```

### Typography
- **Display / Headings**: `Syne` — geometric, strong
- **Body text**: `DM Sans` — clean, readable
- **Code / IDs**: `JetBrains Mono` — for license plates & timestamps

### Reusable Component Classes (`styles.css`)
```
.card            → dark card surface with border
.btn-primary     → amber CTA button
.btn-ghost       → outlined ghost button
.input-field     → styled input/textarea
.select-field    → styled dropdown
.status-paid     → green badge
.status-pending  → yellow badge
.status-violation → red badge
.table-row-hover → row hover effect
```

### How to Improve Styling

1. **Add more color themes** — edit `toll.*` palette in `tailwind.config.js`
2. **Animate the table rows** — add `animation-delay` per row index with `@for`
3. **Add a chart** — use `chart.js` or `ngx-charts` to visualize vehicle type distribution
4. **Dark/Light toggle** — use Tailwind's `dark:` variant and toggle `class="dark"` on `<html>`
5. **Skeleton loading** — replace the spinner with Tailwind animated `bg-toll-border` placeholder rows
6. **Toast notifications** — use Angular CDK Overlay or a library like `ngx-toastr` for success messages

---

## Angular Architecture Patterns Used

| Pattern | Where |
|--------|-------|
| **Standalone Components** | All components (no NgModule) |
| **Signals** | `signal()` + `computed()` for reactive state |
| **Interfaces** | `TollLog`, `CreateTollLogDto` in `models/` |
| **Injectable Service** | `TollService` with `inject()` |
| **Custom Pipe** | `TollCurrencyPipe` for fee formatting |
| **`@Output` + EventEmitter** | Form → App → Dashboard communication |
| **`@ViewChild`** | `AppComponent` calls `dashboard.prependLog()` |
| **`trackBy`** | Performance optimization in `*ngFor` |

---

## Future Enhancements

- [ ] Add Angular Router for multi-page (Dashboard / Reports / Settings)
- [ ] Connect to a real database (PostgreSQL with Prisma or MongoDB)
- [ ] Add WebSocket for real-time vehicle updates
- [ ] Add pagination for large datasets
- [ ] Export logs to CSV
- [ ] Add authentication (JWT)
