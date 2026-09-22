# Order refund process

Harbor Shop refunds a placed order in full or in part after checkout. Orders use ids such as `ord_100` and `ord_200`. Refunds do not change cart totals, coupons, or invoices until the refund is confirmed.

## Eligibility

An order can be refunded when all of the following are true:

- The order exists on the account history page.
- Checkout finished and a receipt with `orderId` is on file.
- The requested amount is greater than zero and not more than the remaining captured total.
- The order is not already fully refunded.

Partial refunds are allowed. Each refund reduces the remaining refundable total.

## Steps

1. Open the latest order from account history and confirm the `orderId`.
2. Choose **full** (remaining captured total) or **partial** (line items or a custom amount).
3. Record the reason (customer request, damaged goods, pricing error, or other).
4. Submit the refund. The payment provider reverses the captured amount.
5. Store the refund id on the order and lower the remaining refundable total.
6. Send the customer a confirmation that includes order id, refund amount, and expected posting time.

## Outcomes

| Result | Meaning |
| --- | --- |
| Succeeded | Provider accepted the reversal. Remaining refundable total is updated. |
| Pending | Provider accepted the request. Funds may take several business days to post. |
| Failed | Provider rejected the reversal. The order total is unchanged. Retry or escalate. |

A failed refund must not mark the order as refunded.

## Notes

- Coupon discounts stay on the original receipt. Refunds use the amount the customer actually paid.
- Tax on a refunded line item is included in the refund amount.
- Shipping is refunded only on a full refund, or when every item in the shipment is returned.
