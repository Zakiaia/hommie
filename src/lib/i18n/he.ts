export const he = {
  // App
  app: {
    name: 'Hommie',
    tagline: 'הדרך החכמה לקנות דירה',
    disclaimer: 'המידע המוצג הינו לצרכי מידע בלבד ואינו מהווה ייעוץ משפטי, מיסויי או פיננסי.',
  },

  // Navigation
  nav: {
    dashboard: 'לוח בקרה',
    onboarding: 'הגדרת פרופיל',
    profile: 'פרופיל הקונה',
    newAnalysis: 'בדיקת נכס',
    settings: 'הגדרות',
    logout: 'התנתק',
    login: 'התחבר',
    signup: 'הרשמה',
  },

  // Auth
  auth: {
    loginTitle: 'התחברות',
    signupTitle: 'הרשמה',
    emailLabel: 'כתובת אימייל',
    passwordLabel: 'סיסמה',
    nameLabel: 'שם מלא',
    loginButton: 'התחבר',
    signupButton: 'צור חשבון',
    googleButton: 'המשך עם Google',
    noAccount: 'אין לך חשבון?',
    hasAccount: 'כבר יש לך חשבון?',
    signupLink: 'הירשם כאן',
    loginLink: 'התחבר כאן',
  },

  // Dashboard
  dashboard: {
    welcome: 'שלום',
    subtitle: 'בוא נתחיל לבנות את התמונה הפיננסית שלך',
    startOnboarding: 'התחל הגדרת פרופיל',
    continueOnboarding: 'המשך הגדרת פרופיל',
    viewProfile: 'צפה בפרופיל הקונה',
    newAnalysis: 'בדוק נכס חדש',
    recentAnalyses: 'בדיקות אחרונות',
    noAnalyses: 'עדיין לא בדקת נכסים',
    profileComplete: 'פרופיל הקונה מוכן',
    profileIncomplete: 'הפרופיל שלך עדיין לא הושלם',
  },

  // Onboarding
  onboarding: {
    title: 'בוא נכיר אותך',
    subtitle: 'כדי שנוכל לתת לך המלצות מדויקות, נצטרך להבין את המצב הפיננסי שלך',
    progress: 'שלב {current} מתוך {total}',
    next: 'המשך',
    back: 'חזור',
    finish: 'סיים והצג פרופיל',
    saving: 'שומר...',

    // Step 1: Household Income
    step1: {
      title: 'הכנסות משק הבית',
      subtitle: 'ספר לנו על ההכנסות החודשיות שלכם',
      primaryIncome: 'הכנסה חודשית נטו (שלך)',
      primaryIncomePlaceholder: '15,000',
      partnerIncome: 'הכנסה חודשית נטו (בן/בת זוג)',
      partnerIncomePlaceholder: '12,000',
      variableIncome: 'הכנסה משתנה / בונוסים (ממוצע חודשי)',
      variableIncomePlaceholder: '3,000',
      employmentType: 'סוג העסקה',
      employmentTypes: {
        SALARIED: 'שכיר',
        SELF_EMPLOYED: 'עצמאי',
        MIXED: 'משולב',
      },
      incomeStability: 'יציבות הכנסה',
      incomeStabilityOptions: {
        HIGH: 'גבוהה',
        MEDIUM: 'בינונית',
        LOW: 'נמוכה',
      },
      expectedChange: 'שינוי צפוי בהכנסה ב-2-3 שנים',
      expectedChangeOptions: {
        INCREASE: 'עלייה',
        STABLE: 'יציבה',
        DECREASE: 'ירידה',
      },
      freeTextPrompt: 'יש משהו חשוב שכדאי שנדע על ההכנסה העתידית שלכם?',
    },

    // Step 2: Monthly Outflows
    step2: {
      title: 'הוצאות חודשיות',
      subtitle: 'מה ההוצאות הקבועות שלכם?',
      obligations: 'התחייבויות חודשיות קיימות (הלוואות, ליסינג וכו׳)',
      obligationsPlaceholder: '2,000',
      currentRent: 'שכר דירה נוכחי',
      currentRentPlaceholder: '5,000',
      fixedExpenses: 'הוצאות קבועות משמעותיות',
      fixedExpensesPlaceholder: '3,000',
      comfortablePayment: 'תשלום משכנתא נוח (חודשי)',
      comfortablePaymentPlaceholder: '8,000',
      paymentCeiling: 'תקרת תשלום חודשי מקסימלית',
      paymentCeilingPlaceholder: '12,000',
      freeTextPrompt: 'יש הוצאות גדולות שאתם צופים בשנים הקרובות?',
    },

    // Step 3: Capital Sources
    step3: {
      title: 'מקורות הון',
      subtitle: 'בוא נבין מה ההון הזמין שלכם — כל סוג בנפרד',

      liquidTitle: 'הון נזיל',
      cash: 'מזומן / עו"ש',
      cashPlaceholder: '100,000',
      liquidSavings: 'חסכונות נזילים',
      liquidSavingsPlaceholder: '50,000',

      semiLiquidTitle: 'הון חצי-נזיל',
      studyFunds: 'קרנות השתלמות',
      studyFundsPlaceholder: '80,000',
      providentFunds: 'קופות גמל',
      providentFundsPlaceholder: '60,000',
      investmentPortfolio: 'תיק השקעות',
      investmentPortfolioPlaceholder: '100,000',
      deposits: 'פיקדונות',
      depositsPlaceholder: '50,000',

      propertyTitle: 'הון מגובה נכס',
      ownsProperty: 'בעלות על נכס קיים',
      yes: 'כן',
      no: 'לא',
      propertyValue: 'שווי מוערך של הנכס',
      propertyValuePlaceholder: '1,500,000',
      propertyMortgage: 'יתרת משכנתא על הנכס',
      propertyMortgagePlaceholder: '500,000',
      expectedSale: 'מתכננים למכור / למחזר?',

      potentialTitle: 'הון פוטנציאלי',
      familySupport: 'עזרה משפחתית',
      familySupportPlaceholder: '200,000',
      expectedBonus: 'בונוס צפוי',
      expectedBonusPlaceholder: '30,000',
      futureAssetSale: 'מכירת נכס עתידית',
      futureAssetSalePlaceholder: '0',
      futureFundRelease: 'שחרור קרנות עתידי',
      futureFundReleasePlaceholder: '0',
    },

    // Step 4: Goal, Timeline, Risk
    step4: {
      title: 'מטרות וסיכון',
      subtitle: 'מה אתם מחפשים?',
      goal: 'מטרה עיקרית',
      goals: {
        RESIDENCE: 'מגורים',
        INVESTMENT: 'השקעה',
        MIXED: 'משולב',
        UNSURE: 'עדיין לא בטוח',
      },
      timeline: 'אופק זמן',
      timelines: {
        SHORT: 'קצר (עד שנה)',
        MEDIUM: 'בינוני (1-3 שנים)',
        LONG: 'ארוך (3+ שנים)',
      },
      riskAppetite: 'נכונות לסיכון',
      risks: {
        LOW: 'נמוכה — עדיף בטוח',
        MEDIUM: 'בינונית — מאוזן',
        HIGH: 'גבוהה — מוכן לסכן',
      },
      priority: 'עדיפות מרכזית',
      priorities: {
        STABILITY: 'יציבות',
        FLEXIBILITY: 'גמישות',
        UPSIDE: 'פוטנציאל עליית ערך',
        MONTHLY_CASH_FLOW: 'תזרים חודשי',
      },
      freeTextPrompt: 'מה הכי חשוב לכם כרגע?',
    },

    // Step 5: Preferences
    step5: {
      title: 'העדפות',
      subtitle: 'יש לכם העדפות ספציפיות?',
      preferredAreas: 'אזורים מועדפים',
      preferredAreasPlaceholder: 'למשל: תל אביב, רמת גן, הרצליה',
      propertyPreference: 'סוג נכס',
      propertyPreferences: {
        NEW_PROJECT: 'פרויקט חדש',
        SECOND_HAND: 'יד שנייה',
        NO_PREFERENCE: 'ללא העדפה',
      },
      budgetRange: 'טווח תקציב (אם יש)',
      budgetMin: 'מינימום',
      budgetMinPlaceholder: '1,500,000',
      budgetMax: 'מקסימום',
      budgetMaxPlaceholder: '2,500,000',
    },

    // Step 6: Additional Context
    step6: {
      title: 'עוד משהו?',
      subtitle: 'יש משהו נוסף שהיועץ שלך צריך לדעת?',
      contextLabel: 'כל מידע נוסף שיכול לעזור לנו',
      contextPlaceholder:
        'למשל: אנחנו שוקלים למכור את הדירה הנוכחית לפני הקנייה, מתכננים ילד בשנה הקרובה, לא רוצים להסתמך על כסף מהמשפחה...',
      examples: [
        'אנחנו עשויים לעבור עיר בעתיד',
        'אנחנו רוצים למכור את הנכס לפני שנקנה',
        'אנחנו רוצים להימנע ממינוף אגרסיבי',
        'אנחנו צופים הוצאות ילדים בקרוב',
      ],
    },
  },

  // Profile
  profile: {
    title: 'פרופיל הקונה שלך',
    subtitle: 'סיכום אסטרטגי של המצב הפיננסי שלך',

    snapshot: {
      title: 'תמונת מצב פיננסית',
      monthlyIncome: 'הכנסה חודשית משוקללת',
      monthlyObligations: 'התחייבויות חודשיות',
      liquidCapital: 'הון נזיל',
      totalCapital: 'הון כולל פוטנציאלי',
      comfortablePayment: 'תשלום חודשי נוח',
      budgetRange: 'טווח תקציב מוערך',
    },

    meaning: {
      title: 'מה זה אומר',
    },

    flags: {
      title: 'דגלים אסטרטגיים',
    },

    actions: {
      findInvestments: 'מצא לי השקעות מתאימות',
      analyzeProperty: 'בדוק נכס ספציפי',
    },
  },

  // Analysis
  analysis: {
    title: 'בדיקת נכס',
    subtitle: 'הזן פרטי נכס לקבלת ניתוח מלא',

    fields: {
      nickname: 'כינוי',
      nicknamePlaceholder: 'למשל: דירה ברמת גן',
      city: 'עיר',
      cityPlaceholder: 'רמת גן',
      neighborhood: 'שכונה',
      neighborhoodPlaceholder: 'רמת חן',
      propertyPrice: 'מחיר הנכס',
      propertyPricePlaceholder: '2,000,000',
      propertyType: 'סוג נכס',
      propertyTypes: {
        NEW_PROJECT: 'פרויקט חדש',
        SECOND_HAND: 'יד שנייה',
      },
      intendedUse: 'ייעוד',
      intendedUses: {
        RESIDENCE: 'מגורים',
        INVESTMENT: 'השקעה',
      },
      estimatedRent: 'שכירות חודשית מוערכת',
      estimatedRentPlaceholder: '5,000',
      closingCosts: 'עלויות סגירה',
      closingCostsPlaceholder: 'אוטומטי: 2% ממחיר הנכס',
      renovationCosts: 'עלויות שיפוץ',
      renovationCostsPlaceholder: '0',
      furnitureCosts: 'ריהוט / מעבר',
      furnitureCostsPlaceholder: '0',
      purchaseTax: 'מס רכישה מוערך',
      purchaseTaxPlaceholder: 'אוטומטי',
      ltv: 'אחוז מימון (LTV)',
      interestRate: 'ריבית משכנתא משוערת (%)',
      mortgageYears: 'תקופת משכנתא (שנים)',
      maintenance: 'תחזוקה חודשית',
      maintenancePlaceholder: '500',
      vacancy: 'הנחת תפוסה (%)',
    },

    defaults: {
      interestRate: '4.5%',
      mortgageYears: '30 שנה',
      maintenance: '₪500/חודש',
      vacancy: '5%',
      closingCosts: '2% ממחיר הנכס',
    },

    submit: 'הפעל ניתוח',
    analyzing: 'מנתח...',
  },

  // Results
  results: {
    title: 'תוצאות הניתוח',
    verdict: {
      VIABLE: 'נראה ישים',
      VIABLE_BUT_TIGHT: 'ישים אבל צפוף',
      HIGH_RISK: 'סיכון גבוה',
      NOT_AFFORDABLE: 'לא בטווח ההישג',
    },
    verdictColors: {
      VIABLE: 'green',
      VIABLE_BUT_TIGHT: 'yellow',
      HIGH_RISK: 'orange',
      NOT_AFFORDABLE: 'red',
    },

    monthlySnapshot: 'תמונת מצב חודשית',
    upfrontSnapshot: 'תמונת מצב הון עצמי',
    costBreakdown: 'פירוט עלויות',
    reasoning: 'הסבר ונימוק',

    fields: {
      monthlyIncome: 'הכנסה חודשית',
      existingObligations: 'התחייבויות קיימות',
      mortgagePayment: 'תשלום משכנתא',
      remainingBuffer: 'יתרה חודשית',
      availableCapital: 'הון זמין',
      upfrontNeeded: 'הון עצמי נדרש',
      surplusOrGap: 'עודף / חוסר',
      downPayment: 'הון עצמי',
      purchaseTax: 'מס רכישה',
      closingCosts: 'עלויות סגירה',
      renovation: 'שיפוץ',
      furniture: 'ריהוט / מעבר',
      totalRequired: 'סה"כ נדרש',
      dtiRatio: 'יחס חוב להכנסה',
      loanAmount: 'סכום הלוואה',
      monthlyCashFlow: 'תזרים חודשי נטו',
    },

    compareButton: 'השווה עם ניתוח אחר',
    newAnalysis: 'בדוק נכס נוסף',
    backToProfile: 'חזור לפרופיל',
  },

  // Chat
  chat: {
    title: 'היועץ שלך',
    placeholder: 'שאל את היועץ שלך...',
    send: 'שלח',
    thinking: 'חושב...',
    welcome: 'שלום! אני היועץ שלך. אפשר לשאול אותי כל שאלה על תהליך רכישת הנכס.',
  },

  // Comparison
  comparison: {
    title: 'השוואת תרחישים',
    scenarioA: 'תרחיש א׳',
    scenarioB: 'תרחיש ב׳',
    selectScenario: 'בחר ניתוח להשוואה',
    compare: 'השווה',
    whichIsSafer: 'מה בטוח יותר?',
    whichIsFlexible: 'מה גמיש יותר?',
    whichHasUpside: 'מה עם יותר פוטנציאל?',
    whichFitsBetter: 'מה מתאים יותר לעדיפויות שלך?',
  },

  // Common
  common: {
    currency: '₪',
    percent: '%',
    perMonth: '/חודש',
    years: 'שנים',
    save: 'שמור',
    cancel: 'ביטול',
    edit: 'ערוך',
    delete: 'מחק',
    loading: 'טוען...',
    error: 'שגיאה',
    success: 'הצלחה',
    required: 'שדה חובה',
    optional: 'אופציונלי',
    notAvailable: 'לא זמין',
  },
} as const;

export type TranslationKeys = typeof he;
