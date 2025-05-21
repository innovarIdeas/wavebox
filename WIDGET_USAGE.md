# Wavebox Chat Widget Usage Guide

## Installation

### Method 1: Direct Script Integration (Recommended for websites)

1. Include the widget script in your HTML:

```html
<script src="https://your-cdn-or-github-pages/dist/widget/widget.js" data-slug="your-chatbot-slug"></script>
```

The `data-slug` attribute is required and identifies your specific chatbot instance.

### Method 2: NPM Package Integration (For React applications)

1. Install the package:

```bash
npm install wavebox
# or
yarn add wavebox
```

2. Use the component in your React application:

```jsx
import { ChatBubbleDialog } from 'wavebox';

function App() {
  return (
    <div>
      {/* Your other components */}
      <ChatBubbleDialog slug="your-chatbot-slug" />
    </div>
  );
}
```

## Configuration

### Customization Options

The widget can be customized with the following attributes:

```html
<script 
  src="https://your-cdn-or-github-pages/dist/widget/widget.js" 
  data-slug="your-chatbot-slug"
></script>
```

## Development

To develop the widget locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Build the widget: `npm run build:widget`
5. Test the widget: `npm run serve:widget`

## Troubleshooting

If the chatbot doesn't appear:

1. Check the console for errors
2. Verify that the `data-slug` attribute is correctly set
3. Make sure the paths to the widget files are correct 