import type { Locale, Testimonial } from '@/types';
import Image from 'next/image';
import { RatingStars } from './RatingStars';
import { Card } from './Card';
import { BadgeCheck } from 'lucide-react';

export function ReviewCard({ review, locale }: { review: Testimonial; locale: Locale }) {
  const date = new Date(review.date).toLocaleDateString(
    locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR',
    { year: 'numeric', month: 'long' }
  );

  return (
    <Card interactive>
      <div className="flex items-start justify-between gap-3">
        <RatingStars rating={review.rating} />
        <span className="shrink-0 font-mono text-xs text-ink-40">{date}</span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-70">&ldquo;{review.comment[locale]}&rdquo;</p>

      {review.photoUrl && (
        <div className="relative mt-4 h-32 w-full overflow-hidden rounded-md">
          <Image src={review.photoUrl} alt="" fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover" />
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-ink-8 pt-4">
        <div>
          <p className="text-sm font-bold">
            {review.companyName ?? review.authorName}
          </p>
          <p className="text-xs text-ink-40">{review.authorContext[locale]}</p>
        </div>
        {review.verified && (
          <span className="ms-auto flex items-center gap-1 text-xs font-semibold text-success">
            <BadgeCheck size={13} />
          </span>
        )}
      </div>
    </Card>
  );
}
