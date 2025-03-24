# Migrating from React Router v5 to v6

This document outlines the key changes and migration steps taken to upgrade from React Router v5 to v6 in the Atila client web app.

## Key Changes

1. **Hooks-based Navigation**
   - Replaced `withRouter` HOC with hooks
   - Using `useNavigate` instead of `history.push`
   - Using `useLocation` instead of `props.location`
   - Using `useParams` instead of `match.params`

2. **Route Configuration**
   - Replaced `Switch` with `Routes`
   - Routes must be wrapped in a `Routes` component
   - `component` prop replaced with `element`
   - Route paths are now relative to parent

## Migration Examples

### 1. Class Components to Function Components

Before (v5):
```typescript
import { withRouter, RouteComponentProps } from 'react-router';

interface Props extends RouteComponentProps {
  // other props
}

class MyComponent extends React.Component<Props> {
  handleClick = () => {
    this.props.history.push('/some-path');
  }
}

export default withRouter(MyComponent);
```

After (v6):
```typescript
import { useNavigate, useLocation } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/some-path');
  }
}

export default MyComponent;
```

### 2. Route Configuration

Before (v5):
```typescript
<Switch>
  <Route path="/about" component={About} />
  <Route path="/users/:id" component={User} />
</Switch>
```

After (v6):
```typescript
<Routes>
  <Route path="/about" element={<About />} />
  <Route path="/users/:id" element={<User />} />
</Routes>
```

### 3. URL Parameters

Before (v5):
```typescript
interface RouteParams {
  id: string;
}

interface Props extends RouteComponentProps<RouteParams> {
  // other props
}

function User(props: Props) {
  const { id } = props.match.params;
}
```

After (v6):
```typescript
function User() {
  const { id } = useParams<{ id: string }>();
}
```

## Components Updated

1. `MentorshipSessionAddEdit.tsx`
   - Replaced `withRouter` with `useNavigate` and `useParams`
   - Updated route handling for session management

2. `CollectionDetail.tsx`
   - Removed `RouteComponentProps`
   - Implemented `useParams` for slug handling

3. `UserProfileMentorship.tsx`
   - Updated to use function component with hooks
   - Implemented proper type definitions for route parameters

## Type Safety

- Added proper TypeScript types for route parameters
- Ensured type safety when using route hooks
- Updated interfaces to remove v5-specific types

## Testing

When updating components that use React Router:
1. Test navigation flows
2. Verify URL parameter handling
3. Check that history navigation works
4. Ensure proper route matching

## Common Issues and Solutions

1. **Type Errors with `useParams`**
   - Solution: Explicitly type the parameters using generics
   ```typescript
   const { id } = useParams<{ id: string }>();
   ```

2. **Route Matching**
   - Solution: Ensure routes are properly nested within `Routes`
   - Check path patterns match v6 syntax

3. **Component Props**
   - Solution: Remove `RouteComponentProps` and use hooks
   - Update prop interfaces to remove router-specific types

## Future Considerations

1. Continue migrating remaining v5 components
2. Update tests to account for new routing patterns
3. Consider implementing lazy loading with new route structure
4. Document any app-specific routing patterns

## Known Issues and Workarounds

### Algolia React InstantSearch Type Compatibility

When using React InstantSearch components with TypeScript, you may encounter type compatibility issues between different versions of React types. This is particularly noticeable with components like `Configure`, `SearchResults`, `Hits`, and `Pagination`.

The error typically looks like:
```typescript
'Component' cannot be used as a JSX component.
  Its type 'typeof Component' is not a valid JSX element type.
    Types of construct signatures are incompatible.
      Type 'new (props: any) => Component' is not assignable to type 'new (props: any, deprecatedLegacyContext?: any) => Component<any, any, any>'.
        Property 'refs' is missing in type 'Component<any, any, any>' but required in type 'Component<any, any, any>'.
```

#### Temporary Workaround

There are two approaches to handle this:

1. Use `React.createElement` with type assertions:
```typescript
React.createElement(Configure as any, { hitsPerPage: HITS_PER_PAGE })
```

2. Create wrapper components with type assertions:
```typescript
const ConfigureWrapper = Configure as React.ComponentType<any>;
const SearchResultsWrapper = SearchResults as React.ComponentType<any>;
const PaginationWrapper = Pagination as React.ComponentType<any>;

// Then use them in JSX:
<ConfigureWrapper hitsPerPage={HITS_PER_PAGE} />
```

#### Long-term Solution

This issue should be addressed by:
1. Ensuring all React-related dependencies are using compatible versions
2. Creating proper type definitions for the Algolia components
3. Opening an issue with react-instantsearch to address the type compatibility

Related files:
- `src/scenes/Search/Search.tsx`
- `src/components/Search/AlgoliaComponents.tsx` 