import python from'../../assets/image/cours/python.png'
import js from'../../assets/image/cours/js.png'
import php from'../../assets/image/cours/php.png'
import laravel from'../../assets/image/cours/laravel.png'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 1, name: 'homePage.categories.cat1', icon: python },
  { id: 2, name: 'homePage.categories.cat2', icon: js },
  { id: 3, name: 'homePage.categories.cat3', icon: php },
  { id: 4, name: 'homePage.categories.cat4', icon: laravel }
];

const Categories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate("/courses", { state: { filter: categoryName } });
  };

  return (
    <section className="categories" >
      <h1 style={{align:'center'}}>{t('homePage.categories.title')}</h1>

      <div className="category-grid">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="category-card" 
            onClick={() => handleCategoryClick(t(category.name))}
            style={{
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection:'column',
              gap:'15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img style={{ width: '40px', height: '40px' }} src={category.icon} alt={t(category.name)} />
            <h4>{t(category.name)}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
