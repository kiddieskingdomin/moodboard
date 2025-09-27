export default function ShippingPolicy() {
  return (
    <div className="bg-[#fff2ea]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
        <p className="mb-4">
          At Kiddies Kingdom, we aim to deliver your favorite toys quickly and safely.
          Please review our shipping terms below.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Processing Time</h2>
        <p className="mb-4">
          Orders are processed within <strong>1–2 business days</strong> after payment
          confirmation. Orders placed on weekends or holidays will be processed the next
          business day.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Time</h2>
        <p className="mb-4">
          Standard delivery takes <strong>3–7 business days</strong>, depending on your
          location. Delays may occur due to weather, public holidays, or courier service
          disruptions.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Charges</h2>
        <p className="mb-4">
          A flat shipping fee of <strong>₹50</strong> is applied on orders below
          ₹999. Orders above ₹999 are eligible for <strong>free shipping</strong>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Order Tracking</h2>
        <p className="mb-4">
          Once your order is shipped, you will receive a tracking number via email or SMS
          so you can follow your package.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">International Shipping</h2>
        <p className="mb-4">
          Currently, we only ship within India. We do not offer international shipping at
          this time.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Delays & Issues</h2>
        <p className="mb-4">
          While we do our best to ensure timely delivery, Kiddies Kingdom is not liable
          for delays caused by courier services or unforeseen circumstances.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p>
          For any questions about shipping, please contact us at{" "}
          <a
            href="mailto:info@kiddieskingdom.co.in"
            className="text-[#d8a298]"
          >
            info@kiddieskingdom.co.in
          </a>.
        </p>
      </div>
    </div>
  );
}
