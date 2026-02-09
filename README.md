# Voter Information System | ভোটার তথ্য সিস্টেম

A modern, user-friendly web application for searching and browsing voter information from Dharmpur, Sitakunda, Chittagong. Built with Next.js 15, TypeScript, and Tailwind CSS, optimized for Bengali text.

## 🎯 Features

- **Fast Search**: Instant fuzzy search across 2,305+ voter records (< 100ms latency)
- **Advanced Filters**: Filter by gender, occupation, and other criteria
- **Bengali Support**: Optimized rendering of Bengali/Bangla text with Noto Sans Bengali
- **Sortable Table**: Sort by any column with TanStack Table
- **Pagination**: Navigate through results with customizable page sizes
- **Export**: Download filtered results as CSV or JSON
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: WCAG 2.1 compliant with keyboard navigation
- **Static Site**: No backend required, deploys anywhere

## 📊 Data

- **Total Voters**: 2,305 records
- **Male**: 1,253 voters
- **Female**: 1,052 voters
- **Fields**: Serial Number, Name, Voter ID, Parents' Names, Occupation, Date of Birth, Address

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git (optional)

### Installation

```bash
# Clone or download this project
cd voter-info-web

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Building for Production

```bash
# Build static site
npm run build

# Preview production build locally
npm run start
```

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Accessible UI components |
| **Fuse.js** | Fuzzy search with Unicode support |
| **TanStack Table** | Powerful table with sorting/pagination |
| **Zustand** | Lightweight state management |
| **Lucide React** | Modern icon library |

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (optional but recommended):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository (or upload the project folder)
   - Vercel will auto-detect Next.js configuration
   - Click "Deploy"

3. **Done!** Your site will be live at `https://your-project.vercel.app`

**Vercel Free Tier includes:**
- Unlimited deployments
- 100GB bandwidth/month
- Automatic HTTPS
- Global CDN
- Custom domains

### Deploy to Netlify

```bash
# Build the site
npm run build

# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=out
```

### Deploy to GitHub Pages

1. Update `next.config.js` with your repository name:
   ```js
   module.exports = {
     output: 'export',
     basePath: '/your-repo-name', // Only if deploying to user.github.io/repo-name
     trailingSlash: true,
     images: {
       unoptimized: true,
     },
   }
   ```

2. Build and deploy:
   ```bash
   npm run build
   # Copy the 'out' folder contents to GitHub Pages
   ```

## 📁 Project Structure

```
voter-info-web/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with Bengali fonts
│   ├── page.tsx             # Main application page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── layout/             # Header, footer
│   ├── search/             # Search bar, filters
│   ├── stats/              # Statistics cards
│   ├── table/              # Voter table, export
│   └── ui/                 # shadcn/ui components
├── lib/                     # Utilities
│   ├── data.ts             # Data loading & filtering
│   ├── search.ts           # Fuse.js search config
│   ├── export.ts           # CSV/JSON export
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Helper functions
├── hooks/                   # Custom React hooks
│   └── use-voter-data.ts   # Data loading hook
├── store/                   # State management
│   └── filter-store.ts     # Zustand filter store
├── public/                  # Static assets
│   └── voter_data.json     # Source data (1.1MB)
└── package.json            # Dependencies
```

## 🔧 Configuration

### Update Voter Data

Replace `public/voter_data.json` with your data. Ensure it follows the structure:

```json
[
  {
    "female": [
      {
        "sl_no": "০০০১",
        "name": "পারুল বালা",
        "voter_no": "১৫০৩০৯১২৬৪৪১",
        "father_name": "হরকুমার নাথ",
        "mother_name": "বিরজা দেবী",
        "occupation": "গৃহিণী",
        "dob": "১৫/০৫/১৯৪৬",
        "address": "বিপিন ডাক্তারের বাড়ী..."
      }
    ],
    "male": [
      // Male voter records...
    ]
  }
]
```

### Customize Branding

Edit `components/layout/header.tsx` to update:
- Logo/Icon
- Application title
- Location information

### Customize Colors

Edit `tailwind.config.ts` and `app/globals.css` to change:
- Primary color (default: blue)
- Background colors
- Font sizes
- Spacing

## 🎨 Usage

### Search

- Type in the search bar to find voters by:
  - Name (নাম)
  - Voter ID (ভোটার নম্বর)
  - Parents' names
  - Address (ঠিকানা)
- Supports fuzzy matching for typos
- Handles both Bengali and English numerals

### Filter

- **Gender**: All / Male (পুরুষ) / Female (মহিলা)
- **Occupation**: Click occupation badges to filter
- **Multiple Filters**: Combine filters for precise results
- **Clear**: Remove all filters at once

### Sort & Paginate

- Click column headers to sort
- Choose rows per page: 25, 50, 100, or 200
- Navigate with Previous/Next buttons

### Export

- Click "Export" button
- Choose CSV or JSON format
- Downloads filtered results only

## 🔍 Search Examples

| Query | Finds |
|-------|-------|
| `পারুল` | All names containing "পারুল" |
| `১৫০৩০৯` | All voter IDs starting with these digits |
| `ধর্মপুর` | All addresses in Dharmpur |
| `গৃহিণী` | All housewives (when searched) |

## ⚡ Performance

- **Initial Load**: < 2 seconds
- **Search Latency**: < 100ms (client-side)
- **Bundle Size**: ~160KB (gzipped)
- **Lighthouse Score**: 95+ (all metrics)
- **Data File**: 1.1MB (cached after first load)

## ♿ Accessibility

- **Keyboard Navigation**: Full support with Tab, Enter, Escape
- **Screen Readers**: ARIA labels for all interactive elements
- **Focus Indicators**: Clear visual focus states
- **High Contrast**: Supports high contrast mode
- **Responsive**: Works on all screen sizes

## 🔒 Privacy & Security

- **No Backend**: All data is static JSON
- **No Tracking**: No cookies, no analytics by default
- **Public Data**: Ensure you have permission to publish voter data
- **HTTPS**: Automatic with Vercel deployment
- **CSP**: Content Security Policy headers (optional)

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Bengali Font Not Loading

- Check internet connection (Google Fonts CDN)
- Verify `app/layout.tsx` font configuration
- Clear browser cache

### Search Not Working

- Ensure `public/voter_data.json` exists
- Check browser console for errors
- Verify data structure matches expected format

## 📝 License

This project is for educational and informational purposes. Ensure you have proper authorization to use and publish voter data.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues or questions:
- Open a GitHub issue
- Check existing documentation
- Review the code comments

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TanStack Table](https://tanstack.com/table)
- [Fuse.js Search](https://fusejs.io)

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
