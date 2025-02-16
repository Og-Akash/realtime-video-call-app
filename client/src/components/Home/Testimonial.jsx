import React from "react";
import "./testimonial.css";
import { QuoteIcon } from "lucide-react";

const testimonials = [
  {
    id: 1,
    text: "ZENO has transformed how our global team collaborates. The video quality is unmatched, and the interface is beautifully intuitive.",
  },
  {
    id: 2,
    text: "Finally, a video calling platform that just works! No more dropped calls or pixelated screens. ZENO delivers crystal clear quality every time.",
  },
  {
    id: 3,
    text: "The security features give us peace of mind when discussing sensitive projects. It's the perfect balance of security and simplicity.",
  },
  {
    id: 4,
    text: "We switched our entire company to ZENO and haven't looked back. The performance improvement over other platforms is remarkable.",
  },
  {
    id: 5,
    text: "As a remote team, clear communication is crucial. ZENO's reliability and quality have made our daily standups so much more productive.",
  },
  {
    id: 6,
    text: "The low-latency experience makes it feel like we're all in the same room. It's changed how we think about remote collaboration.",
  },
];

const Testimonial = () => {
  return (
    <div className="testimonial-section">
      <h1 className="testimonial-heading">What Our Users Say</h1>

      <div className="testimonial-wrapper">
        <div className="testimonial-container animate-scroll">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <QuoteIcon size={36}/>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
          {testimonials.map((testimonial) => (
            <div
              key={`${testimonial.id}-duplicate`}
              className="testimonial-card"
            >
              <QuoteIcon size={36}/>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
