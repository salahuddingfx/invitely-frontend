export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const mockFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do digital invitations work with Invitely?',
    answer: 'With Invitely, you select a professionally designed template, customize it with your names, photos, date, and venue details, and publish it instantly. You receive a unique shareable link (like `invitely.co/sarah-and-alex`) to send to your guests via WhatsApp, email, or social media.'
  },
  {
    id: 'faq-2',
    question: 'Can guests RSVP directly on the web page?',
    answer: 'Absolutely! Guests can fill out the RSVP form on your invitation page. They can specify if they are attending, the number of guests they are bringing, food allergies/preferences, and leave a congratulatory message. You will see their RSVP status instantly updated in your dashboard.'
  },
  {
    id: 'faq-3',
    question: 'Am I allowed to edit details after the invitation is shared?',
    answer: 'Yes. Any edits you make in the Invitation Builder are updated in real-time. If you change the venue location or the date, guests will see the updated details immediately when they refresh or open your link. No need to resend anything!'
  },
  {
    id: 'faq-4',
    question: 'Can I add music and a custom countdown timer?',
    answer: 'Yes! Our templates include configurable count-down clocks showing exactly how many days, hours, and minutes remain. If you upgrade to Premium or VIP, you can add background music that plays when guests "Tap to Open" your invitation envelope.'
  },
  {
    id: 'faq-5',
    question: 'What is the refund policy for Premium/VIP plans?',
    answer: 'Since our templates are loaded instantly and available for customization, all premium upgrade sales are final. However, we offer a robust free tier so you can test all features and see a full preview before committing to a paid plan.'
  }
];
