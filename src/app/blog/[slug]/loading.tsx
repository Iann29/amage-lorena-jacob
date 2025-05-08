import styles from './post.module.css';

export default function PostLoading() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] relative">
      {/* Loading Skeleton para o blog post */}
      <div className="animate-pulse">
        {/* Cabeçalho do post */}
        <div className="relative h-[60vh] w-full max-h-[500px] bg-gray-300">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-center items-center">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="h-14 bg-white/30 w-1/2 mx-auto rounded-lg mb-4"></div>
              <div className="h-5 bg-white/20 w-2/3 mx-auto rounded-lg"></div>
            </div>
          </div>
        </div>
        
        {/* Container do conteúdo */}
        <div className={styles.paperContainer}>
          <div className={styles.contentWrapper}>
            {/* Autor */}
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            
            {/* Conteúdo do post */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-64 bg-gray-200 rounded w-full mt-8"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            
            {/* Rodapé */}
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Área de comentários */}
        <div className="bg-blue-300 h-64 mt-12 w-full opacity-50"></div>
      </div>
    </div>
  );
} 