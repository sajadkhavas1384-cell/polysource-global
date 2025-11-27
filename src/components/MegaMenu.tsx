import { Link } from 'react-router-dom';
import { NavigationItem } from '@/data/navigation';
import { ChevronRight } from 'lucide-react';

interface MegaMenuProps {
  item: NavigationItem;
  onClose: () => void;
}

export function MegaMenu({ item, onClose }: MegaMenuProps) {
  if (item.id !== 'polymer-products' || !item.children) {
    return null;
  }

  return (
    <div className="hidden lg:block absolute left-0 right-0 top-full bg-background border-t border-border shadow-2xl z-[100]">
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-5 gap-6 max-w-[1400px] mx-auto">
          {/* Product Family Columns (4 columns) */}
          {item.children.map((group) => (
            <div key={group.id} className="space-y-4">
              {/* Column Header */}
              <div className="pb-2 border-b border-border/30">
                <Link
                  to={group.href || '#'}
                  onClick={onClose}
                  className="group inline-flex items-center gap-1"
                >
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {group.label.en}
                  </h3>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                {group.description && (
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {group.description.en}
                  </p>
                )}
              </div>

              {/* Sub-items List */}
              {group.children && group.children.length > 0 && (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  {group.children.map((subItem) => (
                    <div key={subItem.id} className="space-y-1.5">
                      {/* Second Level Item */}
                      <Link
                        to={subItem.href || '#'}
                        onClick={onClose}
                        className="block text-sm font-semibold text-foreground hover:text-primary transition-colors leading-snug"
                      >
                        {subItem.label.en}
                      </Link>
                      
                      {/* Third Level Items (if exist) */}
                      {subItem.children && subItem.children.length > 0 && (
                        <ul className="ml-2 space-y-1 pl-2 border-l border-border/40">
                          {subItem.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                to={child.href || '#'}
                                onClick={onClose}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5 group"
                              >
                                <ChevronRight className="h-3 w-3 shrink-0 opacity-50 group-hover:opacity-100" />
                                <span>{child.label.en}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Help Block (5th column) */}
          <div className="bg-muted/40 rounded-xl p-6 border border-border/60 space-y-5 h-fit">
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-foreground">Need Help Choosing?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Not sure which material is right for your application?
              </p>
            </div>

            <Link
              to="/contact"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Get Technical Help
              <ChevronRight className="h-4 w-4" />
            </Link>

            <div className="pt-4 border-t border-border/40">
              <Link
                to="/products"
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse All Products
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
