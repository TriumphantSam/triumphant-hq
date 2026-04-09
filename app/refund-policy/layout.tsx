import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Refund Policy | Triumphant Technological Services',
    description:
        'Refund Policy for digital products sold by Triumphant Technological Services. Understand your rights and how to request support for failed delivery, broken files, or technical issues.',
};

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
