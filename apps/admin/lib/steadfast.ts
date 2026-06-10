import { prisma } from '@bigbazar/db';

export interface SteadfastStats {
    totalOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    deliveryRate: number;
    fraudReports: number;
    trustTier: string;
    trustTierColor: string;
    isMock: boolean;
}

export async function checkSteadfastCustomer(phone: string): Promise<SteadfastStats | null> {
    if (!phone) return null;
    
    // Clean phone number (leave only digits, ensure 11 digits standard for Bangladesh)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 11) return null;

    try {
        const settings = await prisma.storeSetting.findFirst();
        const enableCheck = settings?.enableSteadfastCheck ?? false;
        const apiKey = settings?.steadfastApiKey;
        const secretKey = settings?.steadfastSecretKey;

        // If credentials are not present or checking is disabled, use sandbox mock mode
        if (!enableCheck || !apiKey || !secretKey) {
            return getMockSteadfastStats(cleanPhone);
        }

        // Call Steadfast API: GET https://portal.steadfast.com.bd/api/v1/fraud_check/{phone}
        // with 3 seconds timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
            const response = await fetch(`https://portal.steadfast.com.bd/api/v1/fraud_check/${cleanPhone}`, {
                method: 'GET',
                headers: {
                    'Api-Key': apiKey,
                    'Secret-Key': secretKey,
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                console.warn(`Steadfast API responded with status ${response.status}. Falling back to mock.`);
                return getMockSteadfastStats(cleanPhone);
            }

            const data = await response.json();
            const status = data?.delivery_status;
            if (!status) {
                console.warn('Steadfast API returned unexpected response structure. Falling back to mock.');
                return getMockSteadfastStats(cleanPhone);
            }

            const delivered = Number(status.total_delivered || 0);
            const cancelled = Number(status.total_cancelled || 0);
            const total = delivered + cancelled + Number(status.total_hold || 0) + Number(status.total_in_review || 0);
            const fraudReports = Number(status.total_fraud_report || 0);

            const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0;
            
            let tier = 'New Customer';
            let tierColor = 'gray';

            if (total >= 2) {
                if (fraudReports > 0) {
                    tier = 'High Risk (Flagged Fraud)';
                    tierColor = 'red';
                } else if (deliveryRate >= 80) {
                    tier = 'Trusted';
                    tierColor = 'green';
                } else if (deliveryRate >= 50) {
                    tier = 'Moderate Risk';
                    tierColor = 'yellow';
                } else {
                    tier = 'High Risk';
                    tierColor = 'red';
                }
            }

            return {
                totalOrders: total,
                deliveredOrders: delivered,
                cancelledOrders: cancelled,
                deliveryRate,
                fraudReports,
                trustTier: tier,
                trustTierColor: tierColor,
                isMock: false
            };
        } catch (fetchErr) {
            clearTimeout(timeoutId);
            console.error('Fetch to Steadfast Courier API failed or timed out:', fetchErr);
            return getMockSteadfastStats(cleanPhone);
        }
    } catch (dbErr) {
        console.error('Failed to load settings from DB:', dbErr);
        return null;
    }
}

// Generate deterministic mock stats so that sandbox behaves consistently and realistically
function getMockSteadfastStats(phone: string): SteadfastStats {
    let hash = 0;
    for (let i = 0; i < phone.length; i++) {
        hash = phone.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    const total = (hash % 15) + 1; // 1 to 15 orders
    let delivered = Math.floor(total * 0.85); // default ~85% success
    
    const lastDigit = Number(phone[phone.length - 1] || '0');
    if (lastDigit === 9) {
        delivered = Math.floor(total * 0.3);
    } else if (lastDigit === 8 || lastDigit === 7) {
        delivered = Math.floor(total * 0.65);
    } else if (lastDigit === 0) {
        return {
            totalOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0,
            deliveryRate: 0,
            fraudReports: 0,
            trustTier: 'New customer — no history',
            trustTierColor: 'gray',
            isMock: true
        };
    }

    const cancelled = total - delivered;
    const fraudReports = lastDigit === 9 ? 1 : 0;
    const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

    let tier = 'Trusted';
    let tierColor = 'green';

    if (total >= 2) {
        if (fraudReports > 0) {
            tier = 'High Risk (Flagged Fraud)';
            tierColor = 'red';
        } else if (deliveryRate >= 80) {
            tier = 'Trusted';
            tierColor = 'green';
        } else if (deliveryRate >= 50) {
            tier = 'Moderate Risk';
            tierColor = 'yellow';
        } else {
            tier = 'High Risk';
            tierColor = 'red';
        }
    } else {
        tier = 'New customer — no history';
        tierColor = 'gray';
    }

    return {
        totalOrders: total,
        deliveredOrders: delivered,
        cancelledOrders: cancelled,
        deliveryRate,
        fraudReports,
        trustTier: tier,
        trustTierColor: tierColor,
        isMock: true
    };
}
