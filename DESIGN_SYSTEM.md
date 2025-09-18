# EasyKirana Design System

A comprehensive design system implementing EasyKirana's green primary and saffron/orange accent brand palette with Tailwind CSS v4.

## Color Palette

### Brand Colors (Green)
- `brand-50` to `brand-900` - Primary green scales from #e8f8ee to #0a6a26
- Primary: `brand-500` (#1CB64E) - Main brand color
- Dark: `brand-800` (#0D8F2F) - For emphasis and contrast

### Accent Colors (Saffron/Orange)
- `accent-50` to `accent-900` - Orange/saffron scales from #fff3e6 to #a93f08
- Primary accent: `accent-400` (#FFA22A)
- Secondary: `accent-500` (#FF7F1E)
- Darker: `accent-700` (#EB5C0C)

### Supporting Colors
- `mint-400` (#89E1DB), `mint-500` (#23B3A9) - For tags and illustrations
- `cream-50` to `cream-900` - Background and neutral tones
- Standard gray scale for text

## Gradient Utilities

### Background Gradients
```html
<!-- Brand gradient (green) -->
<div class="bg-brand-gradient"></div>

<!-- Accent gradient (orange) -->
<div class="bg-accent-gradient"></div>
```

### Text Gradients
```html
<!-- Brand text gradient -->
<h1 class="text-gradient-brand">EasyKirana</h1>

<!-- Accent text gradient -->
<span class="text-gradient-accent">Special Offer</span>
```

## Component Classes

### Buttons
```html
<!-- Primary buttons -->
<button class="btn-primary">Standard Primary</button>
<button class="btn-primary-gradient">Gradient Primary</button>

<!-- Accent buttons -->
<button class="btn-accent">Standard Accent</button>
<button class="btn-accent-gradient">Gradient Accent</button>

<!-- Secondary button -->
<button class="btn-secondary">Secondary</button>
```

### Cards & Layout
```html
<!-- Standard card -->
<div class="card">Card content</div>

<!-- Input field -->
<input class="input-field" placeholder="Enter text..." />

<!-- Badge -->
<span class="badge">New</span>

<!-- Link -->
<a href="#" class="link">Learn more</a>
```

## Typography

- **Font Family**: Inter (Google Fonts with fallbacks)
- **Usage**: Apply font-medium or font-semibold for emphasis
- **Gradient text**: Use `text-gradient-brand` for headings

## Motion & Animation

### Soft Float Animation
```html
<div class="float-soft">Gently floating element</div>
```

### Transitions
- Use `transition` or `transition-colors duration-200` for smooth interactions
- Hover states should use brand colors: `hover:text-brand-600`

## Usage Examples

### Hero Section
```html
<section class="bg-gradient-to-br from-brand-50 via-cream-50 to-accent-50">
  <h1 class="text-gradient-brand text-6xl font-bold">
    Fresh Groceries Delivered Daily
  </h1>
  <button class="btn-primary-gradient">Shop Now</button>
</section>
```

### Product Card
```html
<div class="card">
  <div class="bg-accent-gradient text-white px-2 py-1 rounded">
    20% OFF
  </div>
  <h3 class="font-semibold text-gray-900">Product Name</h3>
  <button class="btn-primary">Add to Cart</button>
</div>
```

### Navigation
```html
<nav class="text-gray-700 hover:text-brand-600 transition-colors">
  Categories
</nav>
```

## Accessibility

- **Contrast**: All color combinations meet WCAG AA standards
- **Focus states**: Use `focus:ring-2 focus:ring-brand-500` for form elements
- **Reduced motion**: Float animation respects `prefers-reduced-motion`

## Implementation Notes

- Uses Tailwind CSS v4 with `@theme` tokens in CSS
- Google Fonts loaded with fallback system fonts
- Gradients use brand-appropriate color stops
- All animations are subtle and professional
- Brand green for primary actions, accent orange for highlights only