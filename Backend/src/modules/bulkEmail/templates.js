const templates = {
  newsletter: {
    subject: 'Latest Updates from WheelsRUs',
    html: (name) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(90deg,#7c3aed,#2563eb);padding:24px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">WheelsRUs Newsletter</h1>
        </div>
        <div style="padding:24px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p style="color:#374151;font-size:15px;line-height:1.6">Hi ${name},</p>
          <p style="color:#374151;font-size:15px;line-height:1.6">
            Here are the latest updates from WheelsRUs! We've been working hard to bring you the best
            Hot Wheels die-cast cars and exclusive collections.
          </p>
          <p style="color:#374151;font-size:15px;line-height:1.6">
            Stay tuned for new arrivals, limited editions, and special offers coming your way.
          </p>
          <div style="text-align:center;margin:24px 0">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/collection"
               style="background:linear-gradient(90deg,#7c3aed,#2563eb);color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
              Browse Collection
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:16px">
            Thank you for being part of the WheelsRUs community.
          </p>
        </div>
      </div>
    `,
  },

  promotion: {
    subject: 'Special Offer Just for You!',
    html: (name) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(90deg,#ef4444,#f97316);padding:24px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">Special Promotion</h1>
        </div>
        <div style="padding:24px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p style="color:#374151;font-size:15px;line-height:1.6">Hi ${name},</p>
          <p style="color:#374151;font-size:15px;line-height:1.6">
            We have an exclusive offer just for you! For a limited time, enjoy special prices on select
            Hot Wheels die-cast cars from our premium collection.
          </p>
          <p style="color:#374151;font-size:15px;line-height:1.6">
            Don't miss out — these deals won't last long!
          </p>
          <div style="text-align:center;margin:24px 0">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/collection"
               style="background:linear-gradient(90deg,#ef4444,#f97316);color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
              Shop Now
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:16px">
            Terms and conditions apply. Offer valid while stocks last.
          </p>
        </div>
      </div>
    `,
  },

  announcement: {
    subject: 'Exciting New Arrivals at WheelsRUs!',
    html: (name) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(90deg,#059669,#10b981);padding:24px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">New Arrivals Announcement</h1>
        </div>
        <div style="padding:24px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p style="color:#374151;font-size:15px;line-height:1.6">Hi ${name},</p>
          <p style="color:#374151;font-size:15px;line-height:1.6">
            We're thrilled to announce brand new arrivals at WheelsRUs! Our latest collection features
            rare and exclusive Hot Wheels die-cast cars that every collector needs.
          </p>
          <p style="color:#374151;font-size:15px;line-height:1.6">
            Be the first to get your hands on these new additions before they sell out.
          </p>
          <div style="text-align:center;margin:24px 0">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/collection"
               style="background:linear-gradient(90deg,#059669,#10b981);color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
              View New Arrivals
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:16px">
            Happy collecting from the WheelsRUs team.
          </p>
        </div>
      </div>
    `,
  },
};

export const getTemplate = (type) => {
  const template = templates[type];
  if (!template) return null;
  return {
    subject: template.subject,
    html: template.html,
  };
};

export const templateOptions = Object.keys(templates).map((key) => ({
  value: key,
  label: key.charAt(0).toUpperCase() + key.slice(1),
}));
