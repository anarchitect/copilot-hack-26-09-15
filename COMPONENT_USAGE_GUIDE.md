# Using UI Components Across Different Pages

Our UI components are reused across the application. The examples below reflect the current page composition and navigation.

## Import the Components

```tsx
import Link from "next/link";
import { 
  Hero, 
  SectionContainer, 
  SectionTitle, 
  FeatureCard,
  StatsGrid
} from "@/components/ui";
```

## Examples of Usage in Different Pages

### 1. Homepage (Already Implemented)

```tsx
export default function Home() {
  return (
    <div className="page-gradient">
      {/* Hero Section with title and description */}
      <Hero 
        title="Professional Photo Gallery & Portfolio" 
        description="Upload, organize, and share your photography with automatic optimization, tagging system, and client proofing capabilities."
      />
      
      {/* Feature Cards Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {featureCardsData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconColor={feature.iconColor}
            />
          ))}
        </div>
      </div>

      {/* Sections with custom background colors */}
      <SectionContainer bgColor="bg-white/30 dark:bg-slate-800/30">
        <SectionTitle title="Quick Upload" className="text-center mb-12" />
        <UploadZone />
      </SectionContainer>

      {/* Sections with view all links */}
      <SectionContainer>
        <SectionTitle title="Recent Uploads" viewAllLink="/gallery" />
        <GalleryGrid limit={6} currentPage={1} />
      </SectionContainer>
    </div>
  );
}
```

### 2. Gallery Page

The Gallery page owns Search, tag filters, and Grid/List state. `GalleryGrid` renders either layout and owns the shared photo-detail modal.

```tsx
export default function GalleryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="page-gradient">
      <Hero 
        title="Photo Gallery"
        description="Browse and discover amazing photography"
      />

      <SectionContainer className="mb-4">
        {/* Search, Filters, and Grid/List controls */}
      </SectionContainer>

      <SectionContainer>
        <SectionTitle title="Gallery" />
        <GalleryGrid
          limit={6}
          currentPage={currentPage}
          selectedTags={selectedTags}
          searchQuery={searchQuery}
          viewMode={viewMode}
        />
      </SectionContainer>
    </div>
  );
}
```

### 3. Admin Dashboard

Only the Upload Photos quick action is currently a link. It opens `/upload`. Manage Clients and Settings are display-only cards, and Recent Galleries has no View All link because `/admin/galleries` does not exist.

```tsx
export default function AdminPage() {
  return (
    <div className="page-gradient">
      <Hero
        title="Admin Dashboard"
        description="Manage your galleries, clients, and portfolio"
      />
      
      <SectionContainer>
        <SectionTitle title="Stats Overview" className="mb-6" />
        <StatsGrid stats={dashboardStats} />

        {/* Quick Actions */}
        <SectionTitle title="Quick Actions" />
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/upload" className="block">
            <FeatureCard
              icon={Plus}
              title="Upload Photos"
              description="Add new photos to your galleries with automatic optimization"
              iconColor="text-blue-600"
            />
          </Link>
          {/* Manage Clients and Settings cards */}
        </div>

        {/* Galleries Table */}
        <SectionTitle title="Recent Galleries" />
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          {/* Table content */}
        </div>
      </SectionContainer>
    </div>
  );
}
```

### 4. Upload Page

The header Upload link and Admin Upload Photos card both open this page. The home-page Quick Upload section is a separate inline drop zone and does not include Upload Settings.

```tsx
export default function UploadPage() {
  return (
    <div className="page-gradient">
      <Hero 
        title="Upload Your Photos"
        description="Share your photography with automatic optimization, tagging, and organization. Perfect for building your portfolio or sharing with clients."
      />
      
      <SectionContainer className="pb-0">
        <div className="mb-12">
          <UploadZone />
        </div>
      </SectionContainer>
      
      <SectionContainer bgColor="bg-slate-100 dark:bg-slate-800/50">
        <SectionTitle title="Upload Features" />
        {/* Upload feature cards */}

        <div className="card-base p-6">
          <SectionTitle title="Upload Settings" className="!mb-6" />
          {/* Gallery, visibility, tags, and copyright fields */}
        </div>
      </SectionContainer>
    </div>
  );
}
```

## Benefits of Using These Components

1. **Consistency** - Maintain the same look and feel across all pages
2. **Efficiency** - Reduce repetitive code and make changes in one place
3. **Maintainability** - Easier to update styles and behaviors
4. **Readability** - Cleaner page components with clear separation of concerns

## Extending the Components

You can also extend these components for more specific use cases. For example:

```tsx
// Creating a specialized section component for statistics
function StatsSection({ stats }) {
  return (
    <SectionContainer>
      <SectionTitle title="Statistics" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
            {/* Stat content */}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
```
