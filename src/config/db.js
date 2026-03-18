import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://khanhduylenguyen74_db_user:Guwa67x6n8U24vlH@cluster0.rqijgek.mongodb.net/?appName=Cluster0"
        );
        console.log('Lien Ket Thanh Cong');
    } catch (error) {
        console.log("Lỗi khi liên kết database");
        process.exit(1);
    }
    
}