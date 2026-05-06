# Security Specification for HustleHub AI

## Data Invariants
1. A user profile (`/users/{userId}`) can only be created with the user's own `uid`.
2. Products can only be created by users with a `seller` or `admin` role (implied, but strictly, a user must own the product they create).
3. Orders must link an existing product, buyer, and seller.
4. Timestamps (`createdAt`, `updatedAt`) must be server-managed.

## The Dirty Dozen (Test Payloads)
1. **The ID Spoof**: Create a user profile at `/users/attacker_id` with `data.uid = 'victim_id'`. (Denied by `isOwner`)
2. **The Role Escalation**: Update `/users/my_id` with `role: 'admin'`. (Denied by `affectedKeys().hasOnly`)
3. **The Shadow Field**: Add `verified: true` to a product. (Denied by `isValidProduct`)
4. **The Ghost Price**: Create a product with `price: -100`. (Denied by `isValidProduct` range check)
5. **The Time Warp**: Set `createdAt` to a date in 2030. (Denied by `request.time` check)
6. **The Orphaned Order**: Create an order for a `productId` that doesn't exist. (Denied by `exists()`)
7. **The Price Hijack**: Update another user's product price. (Denied by `isOwner`)
8. **The Status Leap**: Update an order status directly to `delivered` from `pending` without courier involvement (if logic existed).
9. **The PII Leak**: Listen (list) to all `/users` without a specific filter. (Denied by rule-side filter check)
10. **The ID Poisoning**: Create a product with a 2KB string as its document ID. (Denied by `isValidId`)
11. **The Name Bomb**: Set a product name to a 10MB string. (Denied by `.size()`)
12. **The Anonymous Write**: Try to write data without being signed in. (Denied by `isSignedIn`)
