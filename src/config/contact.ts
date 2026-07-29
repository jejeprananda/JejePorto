export const contactConfig = {
  isAvailableForWork: true,
  email: "jessy.prananda@gmail.com",
  locationLabel: "Jakarta, GMT+7",
  responseLabel: "Replies within a few hours",
  availableLabel: "Available for new projects",
  whatsapp: {
    number: "628987847242",
    display: "+62 898-7847-242",
    message: "Hi Jessy, I'd like to talk about a project.",
  },
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/jejeprananda/",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jessy-prananda-22171bb5/",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/jetechtalk",
    },
    {
      label: "Mail",
      href: "mailto:jessy.prananda@gmail.com",
    },
  ],
} as const;

export function getWhatsAppUrl() {
  const { number, message } = contactConfig.whatsapp;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
