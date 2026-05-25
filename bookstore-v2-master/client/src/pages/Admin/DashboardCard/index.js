import styles from "./DashboardCard.module.css"

const cardVariants = {
  'book': styles.cardBook,
  'order': styles.cardOrder,
  'revenue': styles.cardRevenue,
  'user': styles.cardUser,
}

const DashboardCard = ({ name, quantity, Icon, bgColor, variant }) => {
  // Map bgColor bootstrap classes to our new variant system
  const getVariantClass = () => {
    if (variant) return cardVariants[variant] || ''
    if (bgColor?.includes('success')) return styles.cardBook
    if (bgColor?.includes('info')) return styles.cardOrder
    if (bgColor?.includes('danger')) return styles.cardRevenue
    if (bgColor?.includes('warning')) return styles.cardUser
    return ''
  }

  return (
    <div className={`${styles.dashboardCard} ${getVariantClass()}`}>
      <div className={styles.info}>
        <p className={styles.title}>{quantity}</p>
        <span>{name}</span>
      </div>
      <div className={styles.icon}>
        {Icon && <span><Icon /></span>}
      </div>
    </div>
  );
};

export default DashboardCard;
