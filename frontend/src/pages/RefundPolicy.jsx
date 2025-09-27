export default function RefundPolicy() {
  return (
    <div className=" bg-[#fff2ea]">
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
      <p className="mb-4">
        At Kiddies Kingdom, your satisfaction matters to us. If you are not fully
        happy with your purchase, we’re here to help.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Returns</h2>
      <p className="mb-4">
        You have <strong>7 days</strong> from the date of delivery to request a
        return. Items must be unused, in their original packaging, and in the same
        condition as received.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Refunds</h2>
      <p className="mb-4">
        Once we receive your returned item, we will inspect it and notify you of
        the status. If approved, a refund will be initiated to your original
        payment method within <strong>5–7 business days</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Non-Refundable Items</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Gift cards</li>
        <li>Discounted or clearance items</li>
        <li>Customized or personalized products</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Costs</h2>
      <p className="mb-4">
        Shipping fees are non-refundable. If you receive a refund, the cost of
        shipping will be deducted from your refund.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p>
        For any questions regarding returns or refunds, contact us at{" "}
        <a href="mailto:info@kiddieskingdom.co.in" className="text-[#d8a298]">
           info@kiddieskingdom.co.in 
        </a>.
      </p>
    </div>
    </div>
  );
}
