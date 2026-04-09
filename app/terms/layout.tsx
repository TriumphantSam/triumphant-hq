import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | Triumphant Technological Services',
    description:
        'Read the Terms of Service governing your use of this website and the purchase of digital products from Triumphant Technological Services.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
