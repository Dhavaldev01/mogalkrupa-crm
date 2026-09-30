import { loginBarcodeIcon, loginBillingIcon, loginCustomersIcon, loginGSTIcon, loginInventoryIcon, loginPurchasesIcon, loginReportsIcon, loginSalesIcon } from "../icon/loginIcon";

export const categoryOptions = [
    {
        value: 'electronics',
        label: 'Electronics',
        children: [
            {
                value: 'phones',
                label: 'Phones',
                children: [
                    { value: 'iphone', label: 'iPhone' },
                    { value: 'samsung', label: 'Samsung' },
                ],
            },
            {
                value: 'laptops',
                label: 'Laptops',
                children: [
                    { value: 'macbook', label: 'MacBook' },
                    { value: 'thinkpad', label: 'ThinkPad' },
                ],
            }
        ]
    },
    {
        value: 'clothing',
        label: 'Clothing',
        children: [
            { value: 'shirts', label: 'Shirts' },
            { value: 'pants', label: 'Pants' }
        ]
    }
];

export const brandNameOptions = [
    {
        value: 'royalWeave',
        label: 'Royal Weave'
    },
    {
        value: 'adidas',
        label: 'Adidas'
    },
    {
        value: 'Zara',
        label: 'Zara'
    },
]
export const productModeOptions = [
    {
        value: 1,
        label: 'Rent Product'
    },
    {
        value: 2,
        label: 'Retail Product'
    },
]
export const variantProductOptions = [
    {
        value: 'true',
        label: 'Yes Variant'
    },
    {
        value: 'false',
        label: 'No Variant'
    },
]
export const occasionOptions = [
    {
        value: "wedding",
        label: 'Wedding'
    },
    {
        value: "reception",
        label: 'Reception'
    },
    {
        value: "party",
        label: 'Party'
    },
    {
        value: "festive",
        label: 'Festive'
    },
]
export const attributesOptions = [
    {
        attributesTitle: 'Fabric Type',
        attributes: [
            {
                value: 'PremiumImportedJacquard',
                label: 'Premium Imported Jacquard'
            },
            {
                value: 'SilkBlend',
                label: 'Silk Blend'
            },
        ]
    },
    {
        attributesTitle: 'Color',
        attributes: [
            {
                value: 'WhitewithGoldenEmbroidery',
                label: 'White with Golden Embroidery'
            },
        ]
    },
    {
        attributesTitle: 'Pattern',
        attributes: [
            {
                value: 'Embroidered',
                label: 'Embroidered'
            },
        ]
    },
    {
        attributesTitle: 'Fit',
        attributes: [
            {
                value: 'SlimFit',
                label: 'Slim Fit'
            },
            {
                value: 'TailoredFit',
                label: 'Tailored Fit'
            },
        ]
    },
    {
        attributesTitle: 'Size Availability',
        attributes: [
            {
                value: 'S',
                label: 'S'
            },
            {
                value: 'M',
                label: 'M'
            },
            {
                value: 'L',
                label: 'L'
            },
            {
                value: 'XL',
                label: 'XL'
            },
            {
                value: 'XXL',
                label: 'XXL'
            },
            {
                value: 'CustomSizeAvailable',
                label: 'Custom Size Available'
            },
        ]
    },
]

export const selectHSNCodeOptions = [
    {
        value: '6109',
        label: '6109'
    },
    {
        value: '6203',
        label: '6203'
    },
    {
        value: '6204',
        label: '6204'
    },
    {
        value: '6302',
        label: '6302'
    },
]
export const selectGstRateOptions = [
    {
        value: '05%',
        label: '05% GST'
    },
    {
        value: '12%',
        label: '12% GST'
    },
    {
        value: '18%',
        label: '18% GST'
    },
]
export const selectPricingTypeOptions = [
    {
        value: 'Day',
        label: 'Per Day'
    },
    {
        value: 'Event',
        label: 'Per Event'
    },
    {
        value: '3Day',
        label: 'Per 3 Days'
    },
]
export const yesNoOptions = [
    {
        value: "true",
        label: 'Yes'
    },
    {
        value: "false",
        label: 'No'
    },
]
export const returnTypeOptions = [
    {
        value: "1",
        label: "Return",
    },
    {
        value: "2",
        label: "Exchange",
    },
    {
        value: "3",
        label: "Refund",
    },
    {
        value: "4",
        label: "Replacement",
    },
    {
        value: "5",
        label: "Repair",
    },
    {
        value: "6",
        label: "No Return / Final Sale",
    },
];
export const returnDaysOptions = [
    {
        value: '1',
        label: '1 days'
    },
    {
        value: '2',
        label: '2 days'
    },
    {
        value: '3',
        label: '3 days'
    },
    {
        value: '4',
        label: '4 days'
    },
    {
        value: '5',
        label: '5 days'
    },
    {
        value: '6',
        label: '6 days'
    },
    {
        value: '7',
        label: '7 days'
    },
]

export const deliveryMethodOptions = [
    { value: "1", label: 'Delivery' },
    { value: "2", label: 'Store Pickup' },
    { value: "3", label: 'Both' },
]
export const rentalDurationOptions = [
    { value: '1day', label: '1 Day' },
    { value: '3day', label: '3 Days' },
    { value: '5day', label: '5 Days' },
]
export const productStatusOptions = [
    { value: "0", label: "Draft" },
    { value: "1", label: "Pending" },
    { value: "2", label: "Active" },
    { value: "3", label: "Inactive" },
];

// Table data

export const allProductData = [
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 0 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#0000FF'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        rentPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        retailPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        purchasePrice: {
            originalPrice: '2500',
            discountPer: '0',
            discountPrice: '0'
        },
        stockItem: {
            currentItem: '210',
            totalItem: '250'
        },
        variants: '6'
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 1 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#FFF000'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        rentPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        retailPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        purchasePrice: {
            originalPrice: '2500',
            discountPer: '0',
            discountPrice: '0'
        },
        stockItem: {
            currentItem: '10',
            totalItem: '80'
        },
        variants: '6'
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 2 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#AAAFFF'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        rentPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        retailPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        purchasePrice: {
            originalPrice: '2500',
            discountPer: '0',
            discountPrice: '0'
        },
        stockItem: {
            currentItem: '50',
            totalItem: '100'
        },
        variants: '6'
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 2 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#FF0000'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        rentPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        retailPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        purchasePrice: {
            originalPrice: '2500',
            discountPer: '0',
            discountPrice: '0'
        },
        stockItem: {
            currentItem: '120',
            totalItem: '500'
        },
        variants: '6'
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 0 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#FFFAAA'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        rentPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        retailPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        purchasePrice: {
            originalPrice: '2500',
            discountPer: '0',
            discountPrice: '0'
        },
        stockItem: {
            currentItem: '210',
            totalItem: '250'
        },
        variants: '6'
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 1 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#000AAA'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        rentPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        retailPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        purchasePrice: {
            originalPrice: '2500',
            discountPer: '0',
            discountPrice: '0'
        },
        stockItem: {
            currentItem: '10',
            totalItem: '80'
        },
        variants: '6'
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 2 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#BCBCBC'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        rentPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        retailPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        purchasePrice: {
            originalPrice: '2500',
            discountPer: '0',
            discountPrice: '0'
        },
        stockItem: {
            currentItem: '50',
            totalItem: '100'
        },
        variants: '6'
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 2 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#dfc9be'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        rentPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        retailPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        purchasePrice: {
            originalPrice: '2500',
            discountPer: '0',
            discountPrice: '0'
        },
        stockItem: {
            currentItem: '120',
            totalItem: '500'
        },
        variants: '6'
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 0 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#b0c9d7'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        rentPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        retailPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        purchasePrice: {
            originalPrice: '2500',
            discountPer: '0',
            discountPrice: '0'
        },
        stockItem: {
            currentItem: '210',
            totalItem: '250'
        },
        variants: '6'
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 1 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#656680'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        rentPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        retailPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        purchasePrice: {
            originalPrice: '2500',
            discountPer: '0',
            discountPrice: '0'
        },
        stockItem: {
            currentItem: '10',
            totalItem: '80'
        },
        variants: '6'
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 2 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#494b52'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        rentPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        retailPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        purchasePrice: {
            originalPrice: '2500',
            discountPer: '0',
            discountPrice: '0'
        },
        stockItem: {
            currentItem: '50',
            totalItem: '100'
        },
        variants: '6'
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 2 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#00c316'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        rentPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        retailPrice: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        purchasePrice: {
            originalPrice: '2500',
            discountPer: '0',
            discountPrice: '0'
        },
        stockItem: {
            currentItem: '120',
            totalItem: '500'
        },
        variants: '6'
    },
]

export const allOrderData = [
    {
        orderId: '#SSO-CEL20251017/3',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            },
        ],
        rentPrice: '3550',
        retailPrice: null,
        statusDate: {
            status: 0, // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
            returnDate: null
        },
        paymentType: 'Online - Google Pay',
        rentalPeriod: {
            leaveDate: '2024-11-27T10:00:00',
            reciveDate: '2024-11-29T14:30:00',
        }
    },
    {
        orderId: '#SSO-CEL20251017/3',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            },
        ],
        rentPrice: null,
        retailPrice: '3550',
        statusDate: {
            status: 1, // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
            returnDate: '2024-11-29T14:30:00'
        },
        paymentType: 'Online - Bharat Pay',
        rentalPeriod: {
            leaveDate: null,
            reciveDate: null,
        }
    },
    {
        orderId: '#SSO-CEL20251017/3',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            }
        ],
        rentPrice: '3550',
        retailPrice: null,
        statusDate: {
            status: 0, // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
            returnDate: null
        },
        paymentType: 'Online - Google Pay',
        rentalPeriod: {
            leaveDate: '2024-11-27T10:00:00',
            reciveDate: '2024-11-29T14:30:00',
        }
    },
    {
        orderId: '#SSO-CEL20251017/3',
        customerDetails: {
            img: '',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
                retailPrice: {
                    originalPrice: null,
                    discountPer: null,
                    discountPrice: null
                },
            }
        ],
        rentPrice: '3550',
        retailPrice: null,
        statusDate: {
            status: 0, // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
            returnDate: null
        },
        paymentType: 'Online - Google Pay',
        rentalPeriod: {
            leaveDate: '2024-11-27T10:00:00',
            reciveDate: '2024-11-29T14:30:00',
        }
    },
]
export const retailOrderData = [
    {
        orderId: '#SSO-CEL20251017/3',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
        ],
        retailPrice: '3550',
        statusDate: {
            status: 0, // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
            returnDate: null
        },
        paymentType: 'Online - Google Pay',
    },
    {
        orderId: '#SSO-CEL20251017/3',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
        ],
        retailPrice: '3550',
        statusDate: {
            status: 1, // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
            returnDate: '2024-11-29T14:30:00'
        },
        paymentType: 'Online - Bharat Pay',
    },
]
export const rentOrderData = [
    {
        orderId: '#SSO-CEL20251017/3',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
        ],
        rentPrice: '3550',
        statusDate: {
            status: 0, // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
            returnDate: null
        },
        paymentType: 'Online - Google Pay',
        rentalPeriod: {
            leaveDate: '2024-11-27T10:00:00',
            reciveDate: '2024-11-29T14:30:00',
        }
    },
    {
        orderId: '#SSO-CEL20251017/3',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            }
        ],
        rentPrice: '3550',
        statusDate: {
            status: 0, // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
            returnDate: null
        },
        paymentType: 'Online - Google Pay',
        rentalPeriod: {
            leaveDate: '2024-11-27T10:00:00',
            reciveDate: '2024-11-29T14:30:00',
        }
    },
    {
        orderId: '#SSO-CEL20251017/3',
        customerDetails: {
            img: '',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                rentPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            }
        ],
        rentPrice: '3550',
        statusDate: {
            status: 0, // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
            returnDate: null
        },
        paymentType: 'Online - Google Pay',
        rentalPeriod: {
            leaveDate: '2024-11-27T10:00:00',
            reciveDate: '2024-11-29T14:30:00',
        }
    },
]
export const returnOrderData = [
    {
        orderId: '#SSO-CEL20251017/3',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                retailPrice: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
        ],
        retailPrice: '3550',
        statusDate: {
            status: 1, // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
            returnDate: '2024-11-29T14:30:00'
        },
        paymentType: 'Online - Bharat Pay',
    },
]

export const orderDetailData = [
    {
        img: 'https://github.com/shadcn.png',
        name: 'White blazzer with golden embrodory work',
        price: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        attributes: [
            {
                name: 'Color',
                value: 'White'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Cotton'
            },
        ],
        quantity: 2
    },
    {
        img: 'https://github.com/shadcn.png',
        name: 'White blazzer with golden embrodory work',
        price: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        attributes: [
            {
                name: 'Color',
                value: 'White'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Cotton'
            },
        ],
        quantity: 2
    },
    {
        img: 'https://github.com/shadcn.png',
        name: 'White blazzer with golden embrodory work',
        price: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        attributes: [
            {
                name: 'Color',
                value: 'White'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Cotton'
            },
        ],
        quantity: 2
    },
    {
        img: 'https://github.com/shadcn.png',
        name: 'White blazzer with golden embrodory work',
        price: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        attributes: [
            {
                name: 'Color',
                value: 'White'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Cotton'
            },
        ],
        quantity: 2
    },
    {
        img: 'https://github.com/shadcn.png',
        name: 'White blazzer with golden embrodory work',
        price: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        attributes: [
            {
                name: 'Color',
                value: 'White'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Cotton'
            },
        ],
        quantity: 2
    },
    {
        img: 'https://github.com/shadcn.png',
        name: 'White blazzer with golden embrodory work',
        price: {
            originalPrice: '7100',
            discountPer: '50',
            discountPrice: '3550'
        },
        attributes: [
            {
                name: 'Color',
                value: 'White'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Cotton'
            },
        ],
        quantity: 2
    },
]

export const otherOrderData = [
    {
        orderId: "#SSO-CEL20251017/3",
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
        ],
    },
    {
        orderId: "#SSO-CEL20251017/3",
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
        ],
    },
    {
        orderId: "#SSO-CEL20251017/3",
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
        ],
    },
    {
        orderId: "#SSO-CEL20251017/3",
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                price: {
                    originalPrice: '7100',
                    discountPer: '50',
                    discountPrice: '3550'
                },
            },
        ],
    },
]

export const selectCustomerOptions = [
    {
        img: 'https://github.com/shadcn.png',
        name: 'Ravi Patel',
        mobile: '+91 9090909090'
    },
    {
        img: 'https://github.com/shadcn.png',
        name: 'Yash Patel',
        mobile: '+91 9191919191'
    },
]
export const orderTypeOption = [
    {
        value: "1",
        label: 'Delivery Order'
    },
    {
        value: "2",
        label: 'Pickup Order'
    },
]
export const paymentTypeOption = [
    {
        value: 0,
        label: 'UPI App'
    },
    {
        value: 1,
        label: 'Debit Card / Credit Card'
    },
    {
        value: 2,
        label: 'Cash'
    },
    {
        value: 3,
        label: 'UPI App and Cash'
    },
    {
        value: 4,
        label: 'Card and Cash'
    },
]
export const upiAppOption = [
    {
        value: 0,
        label: 'Phone Pay'
    },
    {
        value: 2,
        label: 'Google Pay'
    },
    {
        value: 3,
        label: 'Bharat Pay'
    },
    {
        value: 4,
        label: 'Paytm'
    },
    {
        value: 5,
        label: 'Amazon Pay'
    },
    {
        value: 6,
        label: 'BHIM'
    },
    {
        value: 7,
        label: 'Other'
    },
]

export const selectStateOptions = [
    { value: 0, label: 'Gujarat' },
    { value: 1, label: 'Maharashtra' },
    { value: 2, label: 'Rajasthan' },
    { value: 3, label: 'Madhya Pradesh' },
    { value: 4, label: 'Uttar Pradesh' },
    { value: 5, label: 'Bihar' },
    { value: 6, label: 'Punjab' },
    { value: 7, label: 'Haryana' },
    { value: 8, label: 'Karnataka' },
    { value: 9, label: 'Tamil Nadu' },
]

export const stateCityOptions = [
    { value: 0, label: "Ahmedabad" },
    { value: 1, label: "Surat" },
    { value: 2, label: "Vadodara" },
    { value: 3, label: "Rajkot" },
    { value: 4, label: "Bhavnagar" },
]
export const salesmanOptions = [
    { value: 0, label: "Ravi Patel" },
    { value: 1, label: "Yash Patel" },
    { value: 2, label: "Dhaval Patel" },
    { value: 3, label: "Jigar Patel" },
]

export const confirmBookingData = [
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 0 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#0000FF'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        dateTime: {
            delivery: '2026-04-29',
            return: '2026-04-29',
        },
        quantity: 2,
        mrpPrice: 3225,
        cgst: 53.57,
        sgst: 53.57,
        igst: 0,
        taxableAmount: 1000,
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 1 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#FFF000'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        dateTime: {
            delivery: '2026-04-29',
            return: '2026-04-29',
        },
        quantity: 2,
        mrpPrice: 3225,
        cgst: 53.57,
        sgst: 53.57,
        igst: 0,
        taxableAmount: 1000,
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 2 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#AAAFFF'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        dateTime: {
            delivery: '2026-04-29',
            return: '2026-04-29',
        },
        quantity: 2,
        mrpPrice: 3225,
        cgst: 53.57,
        sgst: 53.57,
        igst: 0,
        taxableAmount: 1000,
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 2 //0=Active, 1=InActive, 2=Pending
        },
        productTages: [
            {
                name: 'Color',
                value: '#FF0000'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        dateTime: {
            delivery: '2026-04-29',
            return: '2026-04-29',
        },
        quantity: 2,
        mrpPrice: 3225,
        cgst: 53.57,
        sgst: 53.57,
        igst: 0,
        taxableAmount: 1000,
    },
]

export const discountRadioOptions = [
    {
        value: "flat",
        label: 'Flat (₹)'
    },
    {
        value: "percentage",
        label: 'Percentage (%)'
    },
]
export const gstTypeRadioOptions = [
    {
        value: 'false',
        label: 'With GST'
    },
    {
        value: 'true',
        label: 'Without GST'
    },
]

export const customerData = [
    {
        customerId: '#SS001',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        email: 'ravi.patel00@gmail.com',
        orders: '260',
        firstShopping: '2022-11-27 08:23',
    },
    {
        customerId: '#SS002',
        customerDetails: {
            img: '',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        email: '',
        orders: '5',
        firstShopping: '2022-11-27 08:23',
    },
    {
        customerId: '#SS003',
        customerDetails: {
            img: '',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        email: 'ravi.patel00@gmail.com',
        orders: '50',
        firstShopping: '2022-11-27 08:23',
    },
    {
        customerId: '#SS004',
        customerDetails: {
            img: '',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        email: 'ravi.patel00@gmail.com',
        orders: '7',
        firstShopping: '2022-11-27 08:23',
    },
    {
        customerId: '#SS005',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        email: '',
        orders: '0',
        firstShopping: '2022-11-27 08:23',
    },
    {
        customerId: '#SS006',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        email: '',
        orders: '0',
        firstShopping: '2022-11-27 08:23',
    },
    {
        customerId: '#SS007',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        email: '',
        orders: '0',
        firstShopping: '2022-11-27 08:23',
    },
    {
        customerId: '#SS007',
        customerDetails: {
            img: '',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        email: 'ravi.patel00@gmail.com',
        orders: '0',
        firstShopping: '2022-11-27 08:23',
    },
    {
        customerId: '#SS007',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        email: 'ravi.patel00@gmail.com',
        orders: '0',
        firstShopping: '2022-11-27 08:23',
    },
    {
        customerId: '#SS007',
        customerDetails: {
            img: '',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        email: 'ravi.patel00@gmail.com',
        orders: '80',
        firstShopping: '2022-11-27 08:23',
    },
    {
        customerId: '#SS007',
        customerDetails: {
            img: '',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        email: 'ravi.patel00@gmail.com',
        orders: '43',
        firstShopping: '2022-11-27 08:23',
    },
    {
        customerId: '#SS007',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        email: '',
        orders: '2',
        firstShopping: '2022-11-27 08:23',
    },
]

export const customerRetailOrderData = [
    {
        orderId: '#SSO-CEL20251017/3',
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
        ],
        retailPrice: '3550',
        statusDate: {
            status: [0], // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
            returnDate: null
        },
        paymentType: 'Online - Google Pay',
    },
    {
        orderId: '#SSO-CEL20251017/3',
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
        ],
        retailPrice: '3550',
        statusDate: {
            status: [0, 1], // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
            returnDate: '2024-11-29T14:30:00'
        },
        paymentType: 'Online - Bharat Pay',
    },
    // {
    //     orderId: '#SSO-CEL20251017/3',
    //     customerDetails: {
    //         img: 'https://github.com/shadcn.png',
    //         name: 'Ravi Patel',
    //         number: '+91 90909 09090',
    //     },
    //     totalProduct: [
    //         {
    //             img: 'https://github.com/shadcn.png',
    //             name: 'White blazzer with golden embrodory work',
    //             orderType: 0,
    //             rentPrice: {
    //                 originalPrice: '7100',
    //                 discountPer: '50',
    //                 discountPrice: '3550'
    //             },
    //             retailPrice: {
    //                 originalPrice: null,
    //                 discountPer: null,
    //                 discountPrice: null
    //             },
    //         },
    //         {
    //             img: 'https://github.com/shadcn.png',
    //             name: 'White blazzer with golden embrodory work',
    //             orderType: 0,
    //             rentPrice: {
    //                 originalPrice: '7100',
    //                 discountPer: '50',
    //                 discountPrice: '3550'
    //             },
    //             retailPrice: {
    //                 originalPrice: null,
    //                 discountPer: null,
    //                 discountPrice: null
    //             },
    //         }
    //     ],
    //     rentPrice: '3550',
    //     retailPrice: null,
    //     statusDate: {
    //         status: 0, // Paid=0, Return=1  
    //         dateTime: '2024-11-27T08:23:00',
    //         returnDate: null
    //     },
    //     paymentType: 'Online - Google Pay',
    //     rentalPeriod: {
    //         leaveDate: '2024-11-27T10:00:00',
    //         reciveDate: '2024-11-29T14:30:00',
    //     }
    // },
    // {
    //     orderId: '#SSO-CEL20251017/3',
    //     customerDetails: {
    //         img: '',
    //         name: 'Ravi Patel',
    //         number: '+91 90909 09090',
    //     },
    //     totalProduct: [
    //         {
    //             img: 'https://github.com/shadcn.png',
    //             name: 'White blazzer with golden embrodory work',
    //             orderType: 0,
    //             rentPrice: {
    //                 originalPrice: '7100',
    //                 discountPer: '50',
    //                 discountPrice: '3550'
    //             },
    //             retailPrice: {
    //                 originalPrice: null,
    //                 discountPer: null,
    //                 discountPrice: null
    //             },
    //         },
    //         {
    //             img: 'https://github.com/shadcn.png',
    //             name: 'White blazzer with golden embrodory work',
    //             orderType: 0,
    //             rentPrice: {
    //                 originalPrice: '7100',
    //                 discountPer: '50',
    //                 discountPrice: '3550'
    //             },
    //             retailPrice: {
    //                 originalPrice: null,
    //                 discountPer: null,
    //                 discountPrice: null
    //             },
    //         },
    //         {
    //             img: 'https://github.com/shadcn.png',
    //             name: 'White blazzer with golden embrodory work',
    //             orderType: 0,
    //             rentPrice: {
    //                 originalPrice: '7100',
    //                 discountPer: '50',
    //                 discountPrice: '3550'
    //             },
    //             retailPrice: {
    //                 originalPrice: null,
    //                 discountPer: null,
    //                 discountPrice: null
    //             },
    //         }
    //     ],
    //     rentPrice: '3550',
    //     retailPrice: null,
    //     statusDate: {
    //         status: 0, // Paid=0, Return=1  
    //         dateTime: '2024-11-27T08:23:00',
    //         returnDate: null
    //     },
    //     paymentType: 'Online - Google Pay',
    //     rentalPeriod: {
    //         leaveDate: '2024-11-27T10:00:00',
    //         reciveDate: '2024-11-29T14:30:00',
    //     }
    // },
]

export const customerRentOrderData = [
    {
        orderId: '#SSO-CEL20251017/3',
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
        ],
        rentPrice: '3550',
        statusDate: {
            status: 0, // Paid=0, Cancel=1  
            dateTime: '2024-11-27T08:23:00',
        },
        paymentType: 'Online - Google Pay',
        rentalPeriod: {
            leaveDate: '2024-11-27T10:00:00',
            reciveDate: '2024-11-29T14:30:00',
        }
    },
    {
        orderId: '#SSO-CEL20251017/3',
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
        ],
        rentPrice: '3550',
        statusDate: {
            status: 1, // Paid=0, Cancel=1  
            dateTime: '2024-11-27T08:23:00',
        },
        paymentType: 'Online - Bharat Pay',
        rentalPeriod: {
            leaveDate: '2024-11-27T10:00:00',
            reciveDate: '2024-11-29T14:30:00',
        }
    },
]

export const bookingOrderData = [
    {
        orderId: '#SSO-CEL20251017/3',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
        ],
        rentPrice: '3550',
        advancePrice: '3550',
        statusDate: {
            status: 0, // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
        },
        paymentType: 'Online - Google Pay',
        rentalPeriod: {
            leaveDate: '2024-11-27T10:00:00',
            reciveDate: '2024-11-29T14:30:00',
        }
    },
    {
        orderId: '#SSO-CEL20251017/3',
        customerDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Ravi Patel',
            number: '+91 90909 09090',
        },
        totalProduct: [
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
            {
                img: 'https://github.com/shadcn.png',
                name: 'White blazzer with golden embrodory work',
                orderType: 0,
                originalPrice: '7100',
                discountPer: '50',
                discountPrice: '3550'
            },
        ],
        rentPrice: '3550',
        advancePrice: '3550',
        statusDate: {
            status: 1, // Paid=0, Return=1  
            dateTime: '2024-11-27T08:23:00',
        },
        paymentType: 'Online - Bharat Pay',
        rentalPeriod: {
            leaveDate: '2024-11-27T08:23:00',
            reciveDate: '2024-11-27T08:23:00',
        }
    },
]

export const orderDetailProductData = [
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 0 //0=Booked, 1=Delivered, 2=Return, 3=Cancel
        },
        productTages: [
            {
                name: 'Color',
                value: '#0000FF'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        salesman: 'Ravi Patel',
        dateTime: {
            delivery: '2026-04-29',
            return: '2026-04-29',
        },
        quantity: 2,
        taxablePrice: 892.86,
        cgst: 53.57,
        sgst: 53.57,
        igst: 0,
        totalAmount: 1000,
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 1 //0=Booked, 1=Delivered, 2=Return, 3=Cancel
        },
        productTages: [
            {
                name: 'Color',
                value: '#FFF000'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        salesman: 'Ravi Patel',
        dateTime: {
            delivery: '2026-04-29',
            return: '2026-04-29',
        },
        quantity: 2,
        taxablePrice: 892.86,
        cgst: 53.57,
        sgst: 53.57,
        igst: 0,
        totalAmount: 1000,
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 2 //0=Booked, 1=Delivered, 2=Return, 3=Cancel
        },
        productTages: [
            {
                name: 'Color',
                value: '#AAAFFF'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        salesman: 'Ravi Patel',
        dateTime: {
            delivery: '2026-04-29',
            return: '2026-04-29',
        },
        quantity: 2,
        taxablePrice: 892.86,
        cgst: 53.57,
        sgst: 53.57,
        igst: 0,
        totalAmount: 1000,
    },
    {
        productDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'White blazzer with golden embrodory work',
            sku: 'BLZ-GW-1001-v02',
            status: 3 //0=Booked, 1=Delivered, 2=Return, 3=Cancel
        },
        productTages: [
            {
                name: 'Color',
                value: '#FF0000'
            },
            {
                name: 'Size',
                value: 'M'
            },
            {
                name: 'Material',
                value: 'Linen'
            },
        ],
        salesman: 'Ravi Patel',
        dateTime: {
            delivery: '2026-04-29',
            return: '2026-04-29',
        },
        quantity: 2,
        taxablePrice: 892.86,
        cgst: 53.57,
        sgst: 53.57,
        igst: 0,
        totalAmount: 1000,
    },
]

export const categoryTableData = [
    {
        categoryName: 'Clothing',
        categoryTree: ["Clothing", "Men’s", "Shirt"],
        status: 1,
        dateTime: '2024-11-29T14:30:00'
    },
    {
        categoryName: 'Clothing',
        categoryTree: ["Clothing", "Men’s", "Pants"],
        status: 0,
        dateTime: '2024-11-29T14:30:00'
    },
    {
        categoryName: 'Clothing',
        categoryTree: ["Clothing", "Men’s", "T-Shirt"],
        status: 0,
        dateTime: '2024-11-29T14:30:00'
    },
    {
        categoryName: 'Clothing',
        categoryTree: ["Clothing", "Men’s", "Hoodie"],
        status: 0,
        dateTime: '2024-11-29T14:30:00'
    },
    {
        categoryName: 'Clothing',
        categoryTree: ["Clothing", "Men’s", "Jacket"],
        status: 0,
        dateTime: '2024-11-29T14:30:00'
    },
    {
        categoryName: 'Clothing',
        categoryTree: ["Clothing", "Women’s", "Shirt"],
        status: 0,
        dateTime: '2024-11-29T14:30:00'
    },
    {
        categoryName: 'Clothing',
        categoryTree: ["Clothing", "Women’s", "Pants"],
        status: 0,
        dateTime: '2024-11-29T14:30:00'
    },
    {
        categoryName: 'Clothing',
        categoryTree: ["Clothing", "Women’s", "T-Shirt"],
        status: 0,
        dateTime: '2024-11-29T14:30:00'
    },
    {
        categoryName: 'Clothing',
        categoryTree: ["Clothing", "Women’s", "Hoodie"],
        status: 0,
        dateTime: '2024-11-29T14:30:00'
    },
    {
        categoryName: 'Clothing',
        categoryTree: ["Clothing", "Women’s", "Jacket"],
        status: 0,
        dateTime: '2024-11-29T14:30:00'
    },
    {
        categoryName: 'Clothing',
        categoryTree: ["Clothing", "Women’s", "Dress"],
        status: 0,
        dateTime: '2024-11-29T14:30:00'
    },
    {
        categoryName: 'Clothing',
        categoryTree: ["Clothing", "Women’s", "Crop tops"],
        status: 0,
        dateTime: '2024-11-29T14:30:00'
    },
]

export const notifyStoreUpdateOptions = [
    { value: "0", label: "Never" },
    { value: "1", label: "Weekly" },
    { value: "2", label: "Monthly" },
]

export const billingHistoryData = [
    {
        purchaseDate: '2024-11-29T14:30:00',
        endDate: '2024-11-29T14:30:00',
        plan: {
            type: 0, //0=Monthly, 1=Yearly
            name: 'Starter Plan',
            date: '2024-11-29T14:30:00'
        },
        amount: '1000',
        status: 0 //0=Success, 1=Unpaid, 2=In Progress, 3=Failed
    },
    {
        purchaseDate: '2024-11-29T14:30:00',
        endDate: '2024-11-29T14:30:00',
        plan: {
            type: 1, //0=Monthly, 1=Yearly
            name: 'Starter Plan',
            date: '2024-11-29T14:30:00'
        },
        amount: '1000',
        status: 1 //0=Success, 1=Unpaid, 2=In Progress, 3=Failed
    },
    {
        purchaseDate: '2024-11-29T14:30:00',
        endDate: '2024-11-29T14:30:00',
        plan: {
            type: 0, //0=Monthly, 1=Yearly
            name: 'Starter Plan',
            date: '2024-11-29T14:30:00'
        },
        amount: '1000',
        status: 2 //0=Success, 1=Unpaid, 2=In Progress, 3=Failed
    },
    {
        purchaseDate: '2024-11-29T14:30:00',
        endDate: '2024-11-29T14:30:00',
        plan: {
            type: 1, //0=Monthly, 1=Yearly
            name: 'Starter Plan',
            date: '2024-11-29T14:30:00'
        },
        amount: '1000',
        status: 3 //0=Success, 1=Unpaid, 2=In Progress, 3=Failed
    },
]

export const metaPageListData = [
    {
        pageName: "Home Page",
        metaTitle: "Shagun Fashion | Premium Fashion & Clothing Collection",
        metaDescription: "Discover stylish and premium fashion collections at Shagun Fashion. Explore trending outfits, quality clothing, and exclusive styles designed for every occasion.",
        status: 1 //0=Active, 1=InActive
    },
    {
        pageName: "About Page",
        metaTitle: "About Us | Shagun Fashion",
        metaDescription: "Learn more about Shagun Fashion, our vision, commitment to quality fashion, and dedication to delivering stylish clothing with exceptional customer service.",
        status: 0 //0=Active, 1=InActive
    },
    {
        pageName: "Single Product",
        metaTitle: "Buy Stylish Fashion Wear Online | Shagun Fashion",
        metaDescription: "Shop premium fashion products online at Shagun Fashion. Explore product details, pricing, quality fabrics, and trendy styles for every occasion.",
        status: 0 //0=Active, 1=InActive
    },
    {
        pageName: "Category Page",
        metaTitle: "Fashion Categories | Shagun Fashion Collection",
        metaDescription: "Browse fashion categories at Shagun Fashion including ethnic wear, casual outfits, trendy styles, and premium clothing collections for men and women.",
        status: 0 //0=Active, 1=InActive
    },
    {
        pageName: "Contact Us Page",
        metaTitle: "Contact Shagun Fashion | Customer Support & Inquiry",
        metaDescription: "Get in touch with Shagun Fashion for product inquiries, support, orders, partnerships, or any assistance related to our fashion collections and services.",
        status: 0 //0=Active, 1=InActive
    },
    {
        pageName: "Our Product Page",
        metaTitle: "Our Products | Shagun Fashion Clothing Collection",
        metaDescription: "Explore the complete clothing collection from Shagun Fashion featuring premium fabrics, modern fashion trends, ethnic wear, and stylish outfits for all occasions.",
        status: 0 //0=Active, 1=InActive
    },
]

export const incomeTableData = [
    {
        date: "2026-05-15",
        name: "CUSTOMER RENT",
        details: "2627-27 - PAYMENT (BOOKING)",
        payment: "BANK ACC",
        amount: 1000,
    },
    {
        date: "2026-05-15",
        name: "CUSTOMER RENT",
        details: "2627-27 - PAYMENT (BOOKING)",
        payment: "BANK ACC",
        amount: 1000,
    },
    {
        date: "2026-05-15",
        name: "CUSTOMER RENT",
        details: "2627-27 - PAYMENT (BOOKING)",
        payment: "BANK ACC",
        amount: 1000,
    },
    {
        date: "2026-05-15",
        name: "CUSTOMER RENT",
        details: "2627-27 - PAYMENT (BOOKING)",
        payment: "BANK ACC",
        amount: 1000,
    },
    {
        date: "2026-05-15",
        name: "CUSTOMER RENT",
        details: "2627-27 - PAYMENT (BOOKING)",
        payment: "BANK ACC",
        amount: 1000,
    },
    {
        date: "2026-05-15",
        name: "CUSTOMER RENT",
        details: "2627-27 - PAYMENT (BOOKING)",
        payment: "BANK ACC",
        amount: 1000,
    },
]


export const employeeData = [
    {
        employeeDetails: {
            img: '',
            name: 'Ravi Patel',
            email: 'example@gmail.com'
        },
        userName: 'raviPatel',
        contactNumbers: {
            number1: '9090909090',
            number2: '9191919191'
        },
        branchAddress: {
            branch: 'KexaCode',
            address: '109 - Shaswat Plaza, Punagam Rd, Dayaramnagar Society, Gandhi Nagar, Punagam, Varachha, Surat, Gujarat 395011'
        },
        dateTime: {
            startDate: '2024-11-29T14:30:00',
            lastLoginDate: '2024-11-29T14:30:00',
        },
        status: 0
    },
    {
        employeeDetails: {
            img: 'https://github.com/shadcn.png',
            name: 'Yash Patel',
            email: 'example@gmail.com'
        },
        userName: 'yashPatel',
        contactNumbers: {
            number1: '8238850156',
            number2: '9191919191'
        },
        branchAddress: {
            branch: 'KexaCode',
            address: '109 - Shaswat Plaza, Punagam Rd, Dayaramnagar Society, Gandhi Nagar, Punagam, Varachha, Surat, Gujarat 395011'
        },
        dateTime: {
            startDate: '2024-11-29T14:30:00',
            lastLoginDate: '2024-11-29T14:30:00',
        },
        status: 1
    },
]
export const advancePaymentOptions = [
    {
        label: "HDFC Bank",
        value: "1"
    },
    {
        label: "BOB Bank",
        value: "2"
    }
];

export const securityPaymentOptions = [
    {
        label: "Bank",
        value: "1"
    },
    {
        label: "Cash",
        value: "2"
    }
];
export const paymentModeOptions = [
    {
        label: "Cash",
        value: "1"
    },
    {
        label: "Bank",
        value: "2"
    },
    {
        label: "UPI",
        value: "3"
    },
];
export const finacialYearOptions = [
    {
        label: "2024 to 2025",
        value: "1"
    },
    {
        label: "2025 to 2026",
        value: "2"
    },
    {
        label: "2026 to 2027",
        value: "3"
    },
];
export const currencyFormatOptions = [
    {
        value: "AED",
        label: "AED (د.إ)"
    },
    {
        value: "AFN",
        label: "AFN (؋)"
    },
    {
        value: "ALL",
        label: "ALL (L)"
    },
    {
        value: "AMD",
        label: "AMD (֏)"
    },
    {
        value: "ANG",
        label: "ANG (ƒ)"
    },
    {
        value: "AOA",
        label: "AOA (Kz)"
    },
    {
        value: "ARS",
        label: "ARS ($)"
    },
    {
        value: "AUD",
        label: "AUD (A$)"
    },
    {
        value: "AWG",
        label: "AWG (ƒ)"
    },
    {
        value: "AZN",
        label: "AZN (₼)"
    },
    {
        value: "BAM",
        label: "BAM (KM)"
    },
    {
        value: "BBD",
        label: "BBD ($)"
    },
    {
        value: "BDT",
        label: "BDT (৳)"
    },
    {
        value: "BGN",
        label: "BGN (лв)"
    },
    {
        value: "BHD",
        label: "BHD (.د.ب)"
    },
    {
        value: "BIF",
        label: "BIF (FBu)"
    },
    {
        value: "BMD",
        label: "BMD ($)"
    },
    {
        value: "BND",
        label: "BND ($)"
    },
    {
        value: "BOB",
        label: "BOB (Bs.)"
    },
    {
        value: "BRL",
        label: "BRL (R$)"
    },
    {
        value: "BSD",
        label: "BSD ($)"
    },
    {
        value: "BTN",
        label: "BTN (Nu.)"
    },
    {
        value: "BWP",
        label: "BWP (P)"
    },
    {
        value: "BYN",
        label: "BYN (Br)"
    },
    {
        value: "BZD",
        label: "BZD ($)"
    },
    {
        value: "CAD",
        label: "CAD (C$)"
    },
    {
        value: "CHF",
        label: "CHF (CHF)"
    },
    {
        value: "CLP",
        label: "CLP ($)"
    },
    {
        value: "CNY",
        label: "CNY (¥)"
    },
    {
        value: "COP",
        label: "COP ($)"
    },
    {
        value: "CZK",
        label: "CZK (Kč)"
    },
    {
        value: "DKK",
        label: "DKK (kr)"
    },
    {
        value: "DZD",
        label: "DZD (د.ج)"
    },
    {
        value: "EGP",
        label: "EGP (£)"
    },
    {
        value: "EUR",
        label: "EUR (€)"
    },
    {
        value: "GBP",
        label: "GBP (£)"
    },
    {
        value: "HKD",
        label: "HKD (HK$)"
    },
    {
        value: "HUF",
        label: "HUF (Ft)"
    },
    {
        value: "IDR",
        label: "IDR (Rp)"
    },
    {
        value: "ILS",
        label: "ILS (₪)"
    },
    {
        value: "INR",
        label: "INR (₹)"
    },
    {
        value: "JPY",
        label: "JPY (¥)"
    },
    {
        value: "KRW",
        label: "KRW (₩)"
    },
    {
        value: "KWD",
        label: "KWD (د.ك)"
    },
    {
        value: "LKR",
        label: "LKR (Rs)"
    },
    {
        value: "MAD",
        label: "MAD (د.م.)"
    },
    {
        value: "MXN",
        label: "MXN (MX$)"
    },
    {
        value: "MYR",
        label: "MYR (RM)"
    },
    {
        value: "NGN",
        label: "NGN (₦)"
    },
    {
        value: "NOK",
        label: "NOK (kr)"
    },
    {
        value: "NPR",
        label: "NPR (Rs)"
    },
    {
        value: "NZD",
        label: "NZD (NZ$)"
    },
    {
        value: "OMR",
        label: "OMR (﷼)"
    },
    {
        value: "PKR",
        label: "PKR (₨)"
    },
    {
        value: "PLN",
        label: "PLN (zł)"
    },
    {
        value: "QAR",
        label: "QAR (﷼)"
    },
    {
        value: "RUB",
        label: "RUB (₽)"
    },
    {
        value: "SAR",
        label: "SAR (﷼)"
    },
    {
        value: "SEK",
        label: "SEK (kr)"
    },
    {
        value: "SGD",
        label: "SGD (S$)"
    },
    {
        value: "THB",
        label: "THB (฿)"
    },
    {
        value: "TRY",
        label: "TRY (₺)"
    },
    {
        value: "TWD",
        label: "TWD (NT$)"
    },
    {
        value: "USD",
        label: "USD ($)"
    },
    {
        value: "VND",
        label: "VND (₫)"
    },
    {
        value: "ZAR",
        label: "ZAR (R)"
    },
];

export const currencyPositionOptions = [
    {
        value: "1",
        label: "Left"
    },
    {
        value: "2",
        label: "Right"
    },
    {
        value: "3",
        label: "Left With Space"
    },
    {
        value: "4",
        label: "Right With Space"
    },
]
export const dateFormatOptions = [
    {
        value: "1",
        label: "DD/MM/YYYY"
    },
    {
        value: "2",
        label: "MM/DD/YYYY"
    },
    {
        value: "3",
        label: "DD/MM/YY"
    },
    {
        value: "4",
        label: "MM/DD/YY"
    },
    {
        value: "5",
        label: "YYYY-MM-DD"
    },
    {
        value: "6",
        label: "MMMM D, YYYY"
    },
]
export const timeFormatOptions = [
    {
        value: "1",
        label: "h:mm a"
    },
    {
        value: "2",
        label: "h:mm A"
    },
    {
        value: "3",
        label: "HH:mm"
    },
]
export const employeeRoleOptions = [
    {
        value: "1",
        label: "Owner"
    },
    {
        value: "2",
        label: "Manager"
    },
    {
        value: "3",
        label: "Salesman"
    },
    {
        value: "4",
        label: "Staff"
    },
]

export const productPerformanceTableData = [
    {
        productDetail: {
            name: "Symbol Men's Solid Cotton Formal Shirt | Plain | Full Sleeve - Regular Fit (Available in Plus Sizes)",
            image: '',
            sku: 'B097MTHMS6'
        },
        category: 'Clothing > Men > Shirt',
        totalQuantity: '8',
        bookedQuantity: '8',
        MRP: '150000',
        totalRent: '200000',
        totalDiscount: '0',
        saleQuantity: '8',
        totalSale: '1200000',
        totalEarning: '1250000',
    }
]

export const productPerformanceCategoryOptions = [
    {
        value: "1",
        label: "Blazzer"
    },
    {
        value: "2",
        label: "Choli"
    },
    {
        value: "3",
        label: "Crown"
    },
    {
        value: "4",
        label: "Dimand Jewlaery"
    },
    {
        value: "5",
        label: "Jodhpuri"
    },
    {
        value: "6",
        label: "Lengha"
    },
    {
        value: "7",
        label: "Mithological"
    },
    {
        value: "8",
        label: "Neckless"
    },
]
export const productPerformanceStatusOptions = [
    {
        value: "1",
        label: "All"
    },
    {
        value: "2",
        label: "Active"
    },
    {
        value: "3",
        label: "Inactive"
    },
    {
        value: "4",
        label: "Retire"
    },
]

export const retuenCanvasTableData = [
    {
        _id: 'hsjdabjdhajjuwajksak213w43e5432q3',
        orderID: 'PKW-0014',
        customer: {
            img: '',
            firstName: 'ravi',
            lastName: 'patel',
            mobileNumber: '9999999999',
        },
        productData: [
            {
                url: '',
                productName: 'T-Shirt',
                sku: 'tshirt-red-m',
                creditNoteId: 'CN-0014',
                customer: {
                    img: '',
                    firstName: 'ravi',
                    lastName: 'patel',
                    mobileNumber: '9999999999',
                },
                price: '2000',
                returnDate: '2024-11-29T14:30:00',
            },
            {
                url: '',
                productName: "Man's T-Shirt",
                sku: 'mans-tshirt-red-m',
                creditNoteId: 'CN-0014',
                customer: {
                    img: '',
                    firstName: 'ravi',
                    lastName: 'patel',
                    mobileNumber: '9999999999',
                },
                price: '303',
                returnDate: '2024-11-29T14:30:00',
            },
        ],
        price: '2303',
        returnDate: '2024-11-29T14:30:00',
    }
]

export const barcodeFormateOptions = [
    { value: "CODE128", label: "Code 128 (Standard)" },
    { value: "CODE39", label: "Code 39" },
    { value: "EAN13", label: "EAN-13" },
    { value: "UPC", label: "UPC" },
];

export const generateBarcodeProductTableData = [
    {
        displayImage: {
            url: ''
        },
        productData: {
            productName: 'T-shirt'
        },
        sku: 'mans-tshirt-red-m',
        quantity: 10,
        productVariant: [
            {
                attributeName: 'color',
                valueName: '#f00000'
            },
            {
                attributeName: 'size',
                valueName: 'm'
            },
            {
                attributeName: 'sleeve type',
                valueName: 'half sleeve'
            },
        ],
        price: '51234'
    }
]

export const productReturnReasonOptions = [
    {
        value: "1",
        label: "Damaged or Defective Item"
    },
    {
        value: "2",
        label: "Incorrect Item Received"
    },
    {
        value: "3",
        label: "Wrong Size/Fit"
    },
    {
        value: "4",
        label: "Not as Described"
    },
    {
        value: "5",
        label: "No Longer Needed/Changed Mind"
    },
    {
        value: "6",
        label: "Arrived Too Late"
    },
]

export const apiData = [
    {
        type: "Income",
        date: "2024-11-29T14:30:00",
        name: "CUSTOMER RENT",
        details: "2627-16 - PAYMENT",
        payment: "CASH ACC",
        amount: 3000,
    },
    {
        type: "Expense",
        date: "2024-11-29T14:30:00",
        name: "CUSTOMER RENT",
        details: "2627-15 - REFUND (BOOKING - CANCEL)",
        payment: "CASH ACC",
        amount: 2500,
    },
    {
        type: "Income",
        date: "2024-11-29T14:30:00",
        name: "CUSTOMER RENT",
        details: "2627-16 - PAYMENT (BOOKING)",
        payment: "BANK ACC",
        amount: 2500,
    },
    {
        type: "Income",
        date: "2024-11-29T14:30:00",
        name: "SECURITY INCOME",
        details: "100",
        payment: "BANK ACC",
        amount: 100,
    },
    {
        type: "Income",
        date: "2024-11-29T14:30:00",
        name: "CUSTOMER RENT",
        details: "2627-15 - PAYMENT (BOOKING - DELIVERED)",
        payment: "NITIN TEX",
        amount: 4500,
    },
    {
        type: "Income",
        date: "2024-11-29T14:30:00",
        name: "CUSTOMER RENT",
        details: "2627-7 - PAYMENT (BOOKING - DELIVERED)",
        payment: "NITIN TEX",
        amount: 17000,
    },
    {
        type: "Expense",
        date: "2024-11-29T14:30:00",
        name: "gupta",
        details: "PV2627-1 - PURCHASE",
        payment: "BANK ACC",
        amount: 5000,
    },
    {
        type: "Expense",
        date: "2024-11-29T14:30:00",
        name: "CUSTOMER RENT",
        details: "2627-11 - REFUND (BOOKING - CANCEL)",
        payment: "CASH ACC",
        amount: 2500,
    },
    {
        type: "Income",
        date: "2024-11-29T14:30:00",
        name: "CUSTOMER RENT",
        details: "2627-14 - PAYMENT (BOOKING - RETURN)",
        payment: "BANK ACC",
        amount: 450,
    },
    {
        type: "Expense",
        date: "2024-11-29T14:30:00",
        name: "CUSTOMER RENT",
        details: "2627-9 - REFUND(BOOKING)",
        payment: "BANK ACC",
        amount: 500,
    },
    {
        type: "Expense",
        date: "2024-11-29T14:30:00",
        name: "Fashion",
        details: "detao",
        payment: "NITIN TEX",
        amount: 500,
    },
    {
        type: "Expense",
        date: "2024-11-29T14:30:00",
        name: "GENERAL EXPENSE",
        details: "554",
        payment: "NITIN TEX",
        amount: 600,
    },
];

export const bankAccountData = [
    {
        name: 'Ravi Bank',
        accountNumber: '159999999999',
        type: 'Bank',
        openingBalance: 50000,
        remark: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.",
        date: '2024-11-29T14:30:00',
        status: 1 //1=Active, 2=Inactive
    },
]

export const deliveredOrderTableData = {
    totalRecord: 2,
    data: [
        {
            displayImage: {
                url: ''
            },
            productData: {
                productName: "SaintX Men's Formal Blazer | Fully Lined | Slim Fit | Professional Jacket | Premium Business Formal Suit | Office",
            },
            productStatus: 1,
            sku: "B0FKBVMLGZ",
            productVariant: [
                {
                    attributeName: "color",
                    valueName: "red"
                },
                {
                    attributeName: "sleeve type",
                    valueName: "full sleeve"
                },
            ],
            deliveryDate: "2024-11-29T14:30:00",
            returnDate: "2024-11-29T14:30:00",
            quantity: 5,
            remark: "SaintX Men's Formal Blazer | Fully Lined | Slim Fit | Professional Jacket"
        },
        {
            displayImage: {
                url: ''
            },
            productData: {
                productName: "SaintX Men's Formal Blazer | Fully Lined | Slim Fit | Professional Jacket | Premium Business Formal Suit | Office",
            },
            productStatus: 2,
            sku: "B0FKBVMLGZ",
            productVariant: [
                {
                    attributeName: "color",
                    valueName: "red"
                },
                {
                    attributeName: "sleeve type",
                    valueName: "full sleeve"
                },
            ],
            deliveryDate: "2024-11-29T14:30:00",
            returnDate: "2024-11-29T14:30:00",
            quantity: 5,
            remark: "SaintX Men's Formal Blazer | Fully Lined | Slim Fit | Professional Jacket"
        },
    ]
}

export const expenseTableData = [
    {
        expenseId: 'E2425-4',
        name: "Dhaval Salary",
        type: "Salary",
        payment: 'Ravi Bank',
        amount: 13000,
        details: "August - salary",
        date: "2026-05-02",
    },
    {
        expenseId: 'E2425-4',
        name: "Stationery Material",
        type: "General Expense",
        payment: 'Ravi Bank',
        amount: 13000,
        details: "Buy Stationery Material",
        date: "2026-05-02",
    },
    {
        expenseId: 'E2425-4',
        name: "Pay Light Bill",
        type: "Light Bill",
        payment: 'Ravi Bank',
        amount: 13000,
        details: "Pay August - Light Bill",
        date: "2026-05-02",
    },
    {
        expenseId: 'E2425-4',
        name: "Stitching Kurta",
        type: "Stitching",
        payment: 'Ravi Bank',
        amount: 13000,
        details: "Stitching Kurta",
        date: "2026-05-02",
    },
    {
        expenseId: 'E2425-4',
        name: "Washing Kurta",
        type: "Washing",
        payment: 'Ravi Bank',
        amount: 13000,
        details: "Washing Kurta",
        date: "2026-05-02",
    },
    {
        expenseId: 'E2425-4',
        name: "Meta Ads Marketing",
        type: "Marketing",
        payment: 'Ravi Bank',
        amount: 13000,
        details: "Meta Ads Marketing",
        date: "2026-05-02",
    },
]

export const expenseType = [
    {
        label: "General Expense",
        value: "1"
    },
    {
        label: "Salary",
        value: "2"
    },
    {
        label: "Light Bill",
        value: "3"
    },
    {
        label: "Stitching",
        value: "4"
    },
    {
        label: "Washing",
        value: "5"
    },
    {
        label: "Marketing",
        value: "6"
    },
]

export const purchaseBillData = [
    {
        vendorDetail: {
            img: '',
            firstName: 'ravi',
            lastName: 'patel',
            mobileNumber: '9999999999',
        },
        productData: [
            {
                url: '',
                productName: 'T-Shirt',
                sku: 'tshirt-red-m',
                creditNoteId: 'CN-0014',
                customer: {
                    img: '',
                    firstName: 'ravi',
                    lastName: 'patel',
                    mobileNumber: '9999999999',
                },
                price: '2000',
                returnDate: '2024-11-29T14:30:00',
            },
            {
                url: '',
                productName: "Man's T-Shirt",
                sku: 'mans-tshirt-red-m',
                creditNoteId: 'CN-0014',
                customer: {
                    img: '',
                    firstName: 'ravi',
                    lastName: 'patel',
                    mobileNumber: '9999999999',
                },
                price: '303',
                returnDate: '2024-11-29T14:30:00',
            },
        ],
        quantity: 10,
        price: 50000,
        createdAt: "2024-11-29T14:30:00",
        paymentStatus: 3
    }
]

export const months = [
    { label: "January", value: "1", index: 0 },
    { label: "February", value: "2", index: 1 },
    { label: "March", value: "3", index: 2 },
    { label: "April", value: "4", index: 3 },
    { label: "May", value: "5", index: 4 },
    { label: "June", value: "6", index: 5 },
    { label: "July", value: "7", index: 6 },
    { label: "August", value: "8", index: 7 },
    { label: "September", value: "9", index: 8 },
    { label: "October", value: "10", index: 9 },
    { label: "November", value: "11", index: 10 },
    { label: "December", value: "12", index: 11 },
];

export const billTypeRadioOptions = [
    {
        value: "1",
        label: 'Cash'
    },
    {
        value: "2",
        label: 'Credit'
    },
    {
        value: "3",
        label: 'Partial'
    },
]
export const taxTypeRadioOptions = [
    {
        value: "1",
        label: 'Exclusive - GST Extra'
    },
    {
        value: "2",
        label: 'Inclusive - Include GST'
    },
]
export const billModeRadioOptions = [
    {
        value: "1",
        label: 'Rent Product'
    },
    {
        value: "2",
        label: 'Retail Product'
    },
]
export const purchaseGstTypeRadioOptions = [
    {
        value: "1",
        label: 'CGST/SGST'
    },
    {
        value: "2",
        label: 'IGST'
    },
]

export const documentTypeOptions = [
    {
        value: "1",
        label: "Retail Invoice"
    },
    {
        value: "2",
        label: "Retail Receipt"
    },
    {
        value: "3",
        label: "Rent Invoice"
    },
    {
        value: "4",
        label: "Rent Receipt"
    },
    {
        value: "5",
        label: "Purchase Invoice"
    },
    {
        value: "6",
        label: "Estimate"
    },
    {
        value: "7",
        label: "Quotation"
    },
    {
        value: "8",
        label: "Delivery Challan"
    },
    {
        value: "9",
        label: "Barcode Label"
    },
]

export const loginPointList = [
    {
        icon: loginBillingIcon,
        name: "Billing",
        class: "bg-[#F6DFD1] text-primary",
        iconColor: "bg-[linear-gradient(180deg,#E50914_0%,#993D02_100%)]",
    },
    {
        icon: loginInventoryIcon,
        name: "Inventory",
        class: "bg-[#DEE9F5] text-info",
        iconColor: "bg-[linear-gradient(180deg,#3363FA_0%,#1E3B94_100%)]",
    },
    {
        icon: loginGSTIcon,
        name: "GST",
        class: "bg-[#D0EADD] text-success",
        iconColor: "bg-[linear-gradient(180deg,#16BE49_0%,#0A5822_100%)]",
    },
    {
        icon: loginReportsIcon,
        name: "Reports",
        class: "bg-[#E0D3EB] text-purple-800",
        iconColor: "bg-[linear-gradient(180deg,#9761FD_0%,#5A3A97_100%)]",
    },
    {
        icon: loginPurchasesIcon,
        name: "Customers",
        class: "bg-[#DEE9F5] text-info",
        iconColor: "bg-[linear-gradient(180deg,#3363FA_0%,#1E3B94_100%)]",
    },
    {
        icon: loginCustomersIcon,
        name: "Purchases",
        class: "bg-[#E0D3EB] text-purple-800",
        iconColor: "bg-[linear-gradient(180deg,#9761FD_0%,#5A3A97_100%)]",
    },
    {
        icon: loginBarcodeIcon,
        name: "Sales",
        class: "bg-[#F6DFD1] text-primary",
        iconColor: "bg-[linear-gradient(180deg,#E50914_0%,#993D02_100%)]",
    },
    {
        icon: loginSalesIcon,
        name: "Barcode",
        class: "bg-[#D0EADD] text-success",
        iconColor: "bg-[linear-gradient(180deg,#16BE49_0%,#0A5822_100%)]",
    },
]

export const barcodePaperSizes = [
    {
        value: "A4",
        label: "A4",
        width: 210,
        height: 297,
    },
    {
        value: "LETTER",
        label: "Letter",
        width: 215.9,
        height: 279.4,
    },
    {
        value: "4x6",
        label: "4 × 6 inch",
        width: 101.6,
        height: 152.4,
    },
    {
        value: "A5",
        label: "A5",
        width: 148,
        height: 210,
    },
];

export const barcodeLabelSizes = [
    {
        value: "48x25",
        label: "48 × 25 mm",
        width: 48,
        height: 25,
    },
    {
        value: "50x30",
        label: "50 × 30 mm",
        width: 50,
        height: 30,
    },
    {
        value: "60x40",
        label: "60 × 40 mm",
        width: 60,
        height: 40,
    },
];