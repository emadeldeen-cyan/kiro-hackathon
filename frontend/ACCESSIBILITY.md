# Accessibility Guidelines

This document outlines the accessibility features implemented in the Book Management Application.

## Overview

The application follows WCAG 2.1 Level AA guidelines to ensure accessibility for all users, including those using assistive technologies.

## Key Accessibility Features

### 1. Semantic HTML

- Proper use of semantic elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<header>`)
- Correct heading hierarchy (h1 → h2 → h3)
- Lists use proper `<ul>`, `<ol>`, and `<li>` elements
- Forms use proper `<form>`, `<label>`, and `<input>` associations

### 2. ARIA Labels and Roles

- All interactive elements have descriptive `aria-label` attributes
- Form inputs include `aria-required` and `aria-describedby` where appropriate
- Error messages use `role="alert"` and `aria-live="polite"`
- Loading states use `role="status"` and `aria-live="polite"`
- Navigation elements have `role="navigation"` and descriptive `aria-label`
- Buttons indicate busy state with `aria-busy` attribute

### 3. Keyboard Navigation

- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Focus indicators are visible on all focusable elements
- Enter and Space keys activate buttons and links
- Escape key closes dialogs and modals
- No keyboard traps

### 4. Focus Management

- Custom focus styles defined in global styles
- Focus visible on all interactive elements using `:focus-visible`
- Focus is managed when opening/closing dialogs
- Skip links available for keyboard users (if implemented)

### 5. Color and Contrast

- Text meets WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
- Color is not the only means of conveying information
- Error states use both color and text/icons
- Links are distinguishable from regular text

### 6. Forms

- All form fields have associated labels
- Required fields marked with `aria-required="true"`
- Error messages are announced to screen readers
- Hints and help text associated with `aria-describedby`
- Autocomplete attributes for common fields (username, email, password)

### 7. Images

- All images have descriptive alt text
- Decorative images use `aria-hidden="true"` or empty alt=""
- Icons in buttons have `aria-hidden="true"` with button text providing context

### 8. Dynamic Content

- Loading states announced with `aria-live="polite"`
- Error messages use `role="alert"` for immediate announcement
- Success messages announced appropriately
- Content updates don't disrupt screen reader users

### 9. Responsive Design

- Application works at 200% zoom
- Text can be resized without breaking layout
- Touch targets are at least 44x44 pixels
- Mobile navigation is accessible

### 10. Screen Reader Support

- Tested with NVDA (Windows) and VoiceOver (macOS)
- Proper reading order maintained
- All functionality available to screen reader users
- No content hidden from screen readers unless decorative

## Testing Checklist

### Keyboard Testing
- [ ] Tab through all interactive elements
- [ ] Verify focus indicators are visible
- [ ] Test Enter/Space on buttons and links
- [ ] Test Escape on dialogs
- [ ] Verify no keyboard traps

### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with VoiceOver (macOS)
- [ ] Verify all content is announced
- [ ] Check form labels and errors
- [ ] Test dynamic content updates

### Visual Testing
- [ ] Test at 200% zoom
- [ ] Verify color contrast
- [ ] Check focus indicators
- [ ] Test with high contrast mode
- [ ] Verify text resize works

### Mobile Testing
- [ ] Test touch targets
- [ ] Verify mobile navigation
- [ ] Test with mobile screen readers
- [ ] Check responsive behavior

## Common Patterns

### Button with Icon
```html
<button aria-label="Descriptive action">
  <mat-icon aria-hidden="true">icon_name</mat-icon>
  <span>Button Text</span>
</button>
```

### Form Field with Error
```html
<mat-form-field>
  <mat-label>Field Label</mat-label>
  <input 
    matInput 
    aria-label="Descriptive label"
    aria-required="true"
    aria-describedby="field-hint">
  <mat-hint id="field-hint">Help text</mat-hint>
  <mat-error role="alert">Error message</mat-error>
</mat-form-field>
```

### Loading State
```html
<div role="status" aria-live="polite">
  <mat-spinner aria-label="Loading content"></mat-spinner>
</div>
```

### Error Message
```html
<div class="error-message" role="alert" aria-live="polite">
  {{ errorMessage }}
</div>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Angular Material Accessibility](https://material.angular.io/cdk/a11y/overview)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Reporting Issues

If you encounter accessibility issues, please report them with:
- Description of the issue
- Steps to reproduce
- Assistive technology used (if applicable)
- Browser and version
- Expected vs actual behavior
