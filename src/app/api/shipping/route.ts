import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Shipping from '@/models/Shipping';
import { WILAYAS } from '@/lib/wilayas';

// GET: جلب جميع الأسعار (مع إنشاء افتراضية إذا لم تكن موجودة)
export async function GET() {
  try {
    await connectDB();
    let shippings = await Shipping.find({}).sort({ code: 1 });

    // إذا لم تكن هناك بيانات، ننشئ جميع الولايات بقيم افتراضية
    if (shippings.length === 0) {
      const defaults = WILAYAS.map((w) => ({
        wilaya: w.name,
        code: w.code,
        homePrice: 500,
        officePrice: 300,
      }));
      await Shipping.insertMany(defaults);
      shippings = await Shipping.find({}).sort({ code: 1 });
    }

    return NextResponse.json(shippings);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}

// POST: تحديث سعر ولاية واحدة
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { code, homePrice, officePrice } = body;

    const updated = await Shipping.findOneAndUpdate(
      { code },
      { homePrice: Number(homePrice), officePrice: Number(officePrice) },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}

// PUT: تحديث جميع الأسعار دفعة واحدة
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { shippings } = body;

    for (const s of shippings) {
      await Shipping.findOneAndUpdate(
        { code: s.code },
        { homePrice: Number(s.homePrice), officePrice: Number(s.officePrice) }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}