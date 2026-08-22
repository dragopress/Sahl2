# Finance vertical-slice acceptance tests

- [ ] A user can initialize the tenant chart of accounts.
- [ ] Viewer can read finance reports but cannot create journals.
- [ ] Accountant can create balanced manual journal entries.
- [ ] Unbalanced manual journals are rejected server-side.
- [ ] Cross-tenant account IDs are rejected.
- [ ] A sales invoice posts once even when the posting endpoint is called twice.
- [ ] A customer payment creates one journal entry and one cash transaction.
- [ ] An expense posts to its configured account or the default 613000 account.
- [ ] Trial balance totals are derived from journal lines, never browser totals.
- [ ] Profit equals revenue minus expenses.
- [ ] Cash position equals opening balances plus signed cash transactions.
