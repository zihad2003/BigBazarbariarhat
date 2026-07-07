import { Star } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface Review {
    id: string
    user: string
    rating: number
    comment: string
    createdAt: Date
    verified?: boolean
}


// Mock reviews for now 
const mockReviews: Review[] = [
    {
        id: "1",
        user: "Sarah K.",
        rating: 5,
        comment: "Absolutely love this! The quality is amazing and it fits perfectly.",
        createdAt: new Date("2025-01-15T12:00:00Z"),
        verified: true
    },
    {
        id: "2",
        user: "John D.",
        rating: 4,
        comment: "Really nice product, fast shipping. Would buy again.",
        createdAt: new Date("2024-12-28T14:30:00Z"),
        verified: true
    }
]

interface ProductReviewsProps {
    reviews?: Review[]
    averageRating?: number
    reviewCount?: number
}

export function ProductReviews({ reviews = mockReviews, averageRating = 4.5, reviewCount = 124 }: ProductReviewsProps) {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold font-playfair uppercase tracking-wider text-luxury-black border-b border-gray-200 pb-4">
                Customer Reviews
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Summary */}
                <div className="md:col-span-1 space-y-6 text-center md:text-left bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                    <div className="space-y-1">
                        <div className="text-6xl font-black text-gray-900 tracking-tighter font-mono">{averageRating.toFixed(1)}</div>
                        <div className="flex justify-center md:justify-start gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-5 w-5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-200'}`}
                                />
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Based on {reviewCount} Reports</p>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="space-y-3 w-full pt-6 border-t border-gray-100">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = reviews.filter(r => r.rating === stars).length;
                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                            return (
                                <div key={stars} className="flex items-center gap-4 text-[10px] font-black">
                                    <span className="w-4 text-gray-400">{stars}</span>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Button className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4">
                        Write a Report
                    </Button>
                </div>

                {/* Reviews List */}
                <div className="md:col-span-2 space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-luxury-black font-playfair">{review.user}</h4>
                                    {review.verified && (
                                        <span className="text-[10px] uppercase tracking-wider text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-sm ml-2">Verified Purchase</span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-400 font-lato">{formatDistanceToNow(review.createdAt)} ago</span>
                            </div>
                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < review.rating ? 'fill-luxury-gold text-luxury-gold' : 'text-gray-200'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed font-lato">{review.comment}</p>
                        </div>
                    ))}

                    <button className="w-full py-3 border border-gray-200 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300">
                        View All Reviews
                    </button>
                </div>
            </div>
        </div>
    )
}
