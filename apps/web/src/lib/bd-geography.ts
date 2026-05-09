/**
 * Bangladesh Geography Data
 * - All 64 districts
 * - Chittagong upazilas for conditional selection
 * - Delivery pricing logic
 */

export const BD_DISTRICTS = [
    'Barguna', 'Barisal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur',
    'Bandarban', 'Brahmanbaria', 'Chandpur', 'Chittagong', 'Comilla', "Cox's Bazar",
    'Feni', 'Khagrachari', 'Lakshmipur', 'Noakhali', 'Rangamati',
    'Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur',
    'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail',
    'Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur',
    'Bagerhat', 'Chuadanga', 'Jessore', 'Jhenaidah', 'Khulna', 'Kushtia',
    'Magura', 'Meherpur', 'Narail', 'Satkhira',
    'Bogra', 'Chapainawabganj', 'Joypurhat', 'Naogaon', 'Natore', 'Nawabganj',
    'Pabna', 'Rajshahi', 'Sirajganj',
    'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari',
    'Panchagarh', 'Rangpur', 'Thakurgaon',
    'Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'
].sort();

export const CHITTAGONG_UPAZILAS = [
    'Anwara',
    'Banshkhali',
    'Boalkhali',
    'Chandanaish',
    'Chittagong City',
    'Double Mooring',
    'Fatikchhari',
    'Hathazari',
    'Karnaphuli',
    'Lohagara',
    'Mirsharai',
    'Patiya',
    'Rangunia',
    'Raozan',
    'Sandwip',
    'Satkania',
    'Sitakunda'
].sort();

export type DeliveryZone = 'mirsharai' | 'chittagong' | 'outside';

export interface DeliveryInfo {
    zone: DeliveryZone;
    cost: number;
    label: string;
    description: string;
}

/**
 * Automatically determine delivery zone and cost based on district and upazila selections.
 */
export function getDeliveryInfo(district: string, upazila: string): DeliveryInfo {
    if (district === 'Chittagong' && upazila === 'Mirsharai') {
        return {
            zone: 'mirsharai',
            cost: 0,
            label: 'FREE Delivery',
            description: 'Free home delivery for Mirsharai area'
        };
    }

    if (district === 'Chittagong') {
        return {
            zone: 'chittagong',
            cost: 100,
            label: '৳100',
            description: 'Inside Chittagong district'
        };
    }

    return {
        zone: 'outside',
        cost: 150,
        label: '৳150',
        description: 'Outside Chittagong district'
    };
}
